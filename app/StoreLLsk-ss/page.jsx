'use client'
import React, { useState } from 'react';
import { storeLessonInFirebase } from '@/components/StoreLesson';

export default function LessonSubmissionPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const lessonData = JSON.parse(jsonInput);
      const lessonId = await storeLessonInFirebase(lessonData);
      setMessage(`Lesson successfully stored with ID: ${lessonId}`);
      setJsonInput('');
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setMessage(error.message || 'An error occurred while storing the lesson.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Submit Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Data (JSON)
          </label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter lesson data in JSON format"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Submit Lesson
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