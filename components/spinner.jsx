import React from 'react';
import { motion } from 'framer-motion';

const Spinner = () => {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const circleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const circleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: 'easeInOut',
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="flex space-x-2"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full"
            variants={circleVariants}
            transition={circleTransition}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Spinner;