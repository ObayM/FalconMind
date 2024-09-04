'use client'
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from 'react';

const mockConcepts = {
  'python-fundamentals-syntax-and-variables': {
    title: 'Syntax and Variables In Python',
    content: `
Python is a high-level programming language renowned for its simplicity and readability. Understanding its syntax and variables is fundamental for anyone starting out with Python.

## Basic Syntax

Python uses indentation to define code blocks. Here's a simple example:

\`\`\`python
if True:
    print("This is indented")
print("This is not indented")
\`\`\`

## Variables

Variables in Python are created when you assign a value to them:

\`\`\`python
x = 5
y = "Hello, World!"
\`\`\`

Python is dynamically typed, which means you don't need to declare the type of a variable.
    `,
    resources: [
      {
        title: 'Python Documentation',
        url: 'https://docs.python.org/3/',
      },
      {
        title: 'Python Tutorial',
        url: 'https://youtu.be/4WVZBtqqVM4?si=k29TAj-2ub3uMtdT',
      },
    ]
  },
};

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={tomorrow} className="rounded-md text-sm md:text-base">
      {value}
    </SyntaxHighlighter>
  );
};

export default function ConceptPage({ params }) {
  const { article } = params;
  const concept = mockConcepts[article];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!concept) {
    notFound();
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 flex flex-col">
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{concept.title}</h1>
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
                  {concept.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Resources</h2>
              <ul className="space-y-4">
                {concept.resources.map((resource, index) => (
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
        </div>
      </main>
    </div>
  );
}