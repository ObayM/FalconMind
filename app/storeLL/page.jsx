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
      // Parse the JSON input
      const lessonData = JSON.parse(jsonInput);
      
      // Call the function to store the lesson
      const lessonId = await storeLessonInFirebase(lessonData);
      
      setMessage(`Lesson successfully stored with ID: ${lessonId}`);
      setJsonInput(''); // Clear the input after successful submission
    } catch (error) {
      console.error('Error:', error);
      setIsError(true);
      setMessage(error.message || 'An error occurred while storing the lesson.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Submit Lesson</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter lesson data in JSON format"
          style={{
            width: '100%',
            height: '200px',
            marginBottom: '16px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          required
        />
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
          Submit Lesson
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