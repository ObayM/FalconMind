'use client'
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FaBook, FaVideo, FaCode, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
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
  },
  'python-fundamentals-data-types': {
    title: 'Data Types In Python',
    content: `

Python supports several data types, including integers (int), floating-point numbers (float), strings (str), and lists (list).

## Integers

\`\`\`python
x = 5
\`\`\`

## Floats

\`\`\`python
y = 3.14
\`\`\`

## Strings

\`\`\`python
name = "Alice"
\`\`\`

## Lists

\`\`\`python
fruits = ["apple", "banana", "cherry"]
\`\`\`

Each type serves a different purpose: integers for whole numbers, floats for decimals, strings for text, and lists for ordered collections. Python's dynamic typing system means variables can change types as needed.
    `,
  },
};


// ... (keep the mockConcepts object as is)

const Sidebar = ({ isOpen, setIsOpen }) => (
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
    <button className="lg:hidden absolute top-4 right-4 text-white" onClick={() => setIsOpen(false)}>
      <FaTimes size={24} />
    </button>
    <h2 className="text-xl font-bold mb-6">Resources</h2>
    <nav className="space-y-4">
      <Link href="#" className="flex items-center space-x-3 hover:text-blue-400 transition-colors">
        <FaBook size={20} />
        <span>Documentation</span>
      </Link>
      <Link href="#" className="flex items-center space-x-3 hover:text-blue-400 transition-colors">
        <FaVideo size={20} />
        <span>Video Tutorials</span>
      </Link>
      <Link href="#" className="flex items-center space-x-3 hover:text-blue-400 transition-colors">
        <FaCode size={20} />
        <span>Code Examples</span>
      </Link>
    </nav>
  </div>
);

const RelatedTopics = ({ concepts }) => (
  <div className="mt-8 lg:mt-0 lg:ml-8 lg:w-64">
    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Topics</h2>
    <ul className="space-y-2">
      {Object.entries(concepts).map(([key, value]) => (
        <li key={key}>
          <Link href={`/concept/${key}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {value.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function ConceptPage({ params }) {
  const { article } = params;
  const concept = mockConcepts[article];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!concept) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
          <FaBars size={24} />
        </button>
      </header>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-grow p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">{concept.title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{concept.content}</ReactMarkdown>
                </div>
              </div>
            </div>
            <div className="lg:hidden mt-8">
              <RelatedTopics concepts={mockConcepts} />
            </div>
          </div>
        </main>
        <div className="hidden lg:block">
          <RelatedTopics concepts={mockConcepts} />
        </div>
      </div>
    </div>
  );
}