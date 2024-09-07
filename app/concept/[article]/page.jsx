'use client'
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';
import { fetchLessonFromFirebase } from '@/components/fetchLesson';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={tomorrow} className="rounded-md text-sm md:text-base">
      {value}
    </SyntaxHighlighter>
  );
};

export default function ConceptPage({ params }) {
  const { article } = params;
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const fetchedLesson = await fetchLessonFromFirebase(article);
        if (fetchedLesson) {
          setLesson(fetchedLesson);
        } else {
          setError("Lesson not found");
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        setError("Failed to fetch lesson data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [article]);

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !lesson) {
    return notFound();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 flex flex-col">
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/course" className="inline-flex items-center mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Course
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{lesson.title}</h1>
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Resources</h2>
                <ul className="space-y-4">
                  {lesson.resources.map((resource, index) => (
                    <li key={index}>
                      {resource.url.includes('youtu.be') || resource.url.includes('youtube.com') ? (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{resource.title}</h3>
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src={`https://www.youtube.com/embed/${resource.url.split('/').pop()}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full rounded-md"
                            ></iframe>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{resource.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.url}</p>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}