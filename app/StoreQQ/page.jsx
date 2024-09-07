'use client'
import React, { useState } from 'react';
import { storeQuizData } from '@/components/QuizFirebase'; // Adjust the import path as needed

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
      // Parse the JSON input
      const quizData = JSON.parse(jsonInput);
      
      // Generate a slug from the quiz name
      const slug = quizName.toLowerCase().replace(/\s+/g, '-');
      
      // Call the function to store the quiz data
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Submit Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="quizName" style={{ display: 'block', marginBottom: '8px' }}>Quiz Name:</label>
          <input
            id="quizName"
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="jsonInput" style={{ display: 'block', marginBottom: '8px' }}>Quiz Data (JSON):</label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Enter quiz data in JSON format"
            style={{
              width: '100%',
              height: '200px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Quiz
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '4px',
            backgroundColor: isError ? '#f8d7da' : '#d4edda',
            color: isError ? '#721c24' : '#155724'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}