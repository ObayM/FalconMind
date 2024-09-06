'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from "@/firebase";
import { useUser } from '@clerk/nextjs';
import { FaSpinner } from 'react-icons/fa';



const courses = [
  { id: 'python', name: 'Python' },
];

const ContinueSignup = () => {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    course: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.course) {
      setError('Please select a course.');
      return;
    }

    setIsLoading(true);

    try {
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.id), {
        course: formData.course,
        location: formData.location,
      }, { merge: true });

      // Redirect to dashboard or home page after successful submission
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving data:', error);
      setError('An error occurred while saving your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Complete Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose a Course
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Where are you from?
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm mt-2">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  'Complete Signup'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContinueSignup;