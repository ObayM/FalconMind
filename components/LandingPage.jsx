'use client'
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaTrophy, FaClock, FaLightbulb } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

const LandingPage = () => {
  const { isSignedIn } = useUser();

  const features = [
    { icon: FaRocket, title: 'Gamified Learning Experience', description: 'Turn studying into an exciting adventure' },
    { icon: FaBrain, title: 'AI-Powered Flashcards', description: 'Optimize your memory with smart repetition' },
    { icon: FaTrophy, title: 'Progress Tracking', description: 'Visualize your growth and stay motivated' },
    { icon: FaClock, title: 'Quick, Efficient Lessons', description: 'Learn more in less time with focused content' },
    { icon: FaLightbulb, title: 'Enhanced Memorization', description: 'Leverage AI to boost your retention skills' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-indigo-600 to-indigo-900 dark:from-indigo-900 dark:to-gray-900 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Welcome To FalconMind!
          </h1>
          <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto text-indigo-100 dark:text-indigo-200">
            Harness the power of AI to master any skill. Our platform transforms the way you learn, making it faster, easier, and more enjoyable than ever before.
          </p>
          <Link href={isSignedIn ? "/dashboard" : "/signup"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white dark:bg-indigo-100 text-indigo-600 dark:text-indigo-800 font-bold text-lg py-4 px-10 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-200 transition shadow-lg"
            >
              {isSignedIn ? "Go to Dashboard" : "Embark on Your Learning Journey"}
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white bg-opacity-10 dark:bg-opacity-5 rounded-lg p-8 backdrop-filter backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <feature.icon className="text-5xl mb-6 text-indigo-300 dark:text-indigo-400" />
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-indigo-100 dark:text-indigo-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Join Thousands of Learners Transforming Their Skills
          </h2>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 max-w-3xl mx-auto">
            Don't just learn. Experience a revolutionary approach to skill acquisition. 
            Our AI-driven platform adapts to your unique learning style, making every 
            session more effective than the last.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;