'use client'
import React, { useState } from 'react';
import { storeQuizData } from '@/components/QuizFirebase'; 

export default function QuizSubmissionPage() {
  const [quizName, setQuizName] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!quizName.trim()) {
      setIsError(true);
      setMessage('Quiz name is required.');
      return;
    }

    try {
      const quizData = JSON.parse(jsonInput);
      const slug = quizName.toLowerCase().replace(/\s+/g, '-');
      await storeQuizData(slug, quizData);
      setMessage(`Quiz "${quizName}" successfully stored with slug: ${slug}`);
      setQuizName('');
      setJsonInput('');
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setMessage(error.message || 'An error occurred while storing the quiz data.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="quizName" className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Name
          </label>
          <input
            id="quizName"
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Data (JSON)
          </label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter quiz data in JSON format"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Submit Quiz
        </button>
      </form>
      {message && (
        <div
          className={`mt-6 p-4 rounded-md ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}