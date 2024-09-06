'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBook, FaRobot, FaFeather, FaQuoteLeft, FaComments, FaChartLine, FaTrophy, FaFireAlt, FaClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/nextjs';
import { useProgress } from '@/components/UserProgress';
import { useLearningStats } from '@/components/LearningStats';
import { motion } from 'framer-motion';

const Quotes = [
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
    {
      "text": "Rise above the storm, and you will find the sunshine.",
      "author": "Mario Fernández"
    },
    {
      "text": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston Churchill"
    },
    {
      "text": "The only way to achieve the impossible is to believe it is possible.",
      "author": "Charles Kingsleigh"
    },
    {
      "text": "Your limitation—it's only your imagination.",
      "author": "Unknown"
    },
    {
      "text": "The future belongs to those who believe in the beauty of their dreams.",
      "author": "Eleanor Roosevelt"
    },
    {
      "text": "The harder the struggle, the more glorious the triumph.",
      "author": "Swami Sivananda"
    },
    {
      "text": "Do not wait; the time will never be 'just right.' Start where you stand.",
      "author": "Napoleon Hill"
    },
    {
      "text": "Do something today that your future self will thank you for.",
      "author": "Unknown"
    },
    {
      "text": "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      "author": "Nelson Mandela"
    },
    {
      "text": "You are never too old to set another goal or to dream a new dream.",
      "author": "C.S. Lewis"
    },
    {
      "text": "In the middle of difficulty lies opportunity.",
      "author": "Albert Einstein"
    },
    {
      "text": "The only limit to our realization of tomorrow is our doubts of today.",
      "author": "Franklin D. Roosevelt"
    },
    {
      "text": "Dream big and dare to fail.",
      "author": "Norman Vaughan"
    },
    {
      "text": "Act as if what you do makes a difference. It does.",
      "author": "William James"
    },
    {
      "text": "Believe you can and you're halfway there.",
      "author": "Theodore Roosevelt"
    },
    {
      "text": "Don't watch the clock; do what it does. Keep going.",
      "author": "Sam Levenson"
    },
    {
      "text": "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
      "author": "Joshua J. Marine"
    },
    {
      "text": "You are braver than you believe, stronger than you seem, and smarter than you think.",
      "author": "A.A. Milne"
    },
    {
      "text": "The best way to predict your future is to create it.",
      "author": "Peter Drucker"
    },
    {
      "text": "The journey of a thousand miles begins with one step.",
      "author": "Lao Tzu"
    },
    {
      "text": "Our greatest glory is not in never falling, but in rising every time we fall.",
      "author": "Confucius"
    },
    {
      "text": "Do not be embarrassed by your failures, learn from them and start again.",
      "author": "Richard Branson"
    },
    {
      "text": "Success is how high you bounce when you hit bottom.",
      "author": "George S. Patton"
    },
  
  
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
];

const quickAccessTools = [
  { name: 'AI Flashcards', icon: FaRobot, href: '/flashcards', color: 'bg-blue-500' },
  { name: 'Poem Generator', icon: FaFeather, href: '/poem-creator', color: 'bg-purple-500' },
  { name: 'AI Assistant', icon: FaComments, href: '/ai-assistant', color: 'bg-green-500' },
];

const comingSoon = (WrappedComponent) => {
  return function WithComingSoon(props) {
    return (
      <div className="relative overflow-hidden rounded-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-10 rounded-lg"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <FaClock className="text-5xl text-indigo-500 mb-3 mx-auto" />
            <p className="text-xl font-bold text-gray-800 dark:text-white">Coming Soon!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">We&apos;re working hard to bring you this feature.</p>
          </div>
        </motion.div>
        <div className="filter blur-sm">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

const UserProgress = ({ xp, nextLevelXp, level, streakDays }) => {
  const progress = (xp / nextLevelXp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Level {level}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{xp} / {nextLevelXp} XP</p>
        </div>
        <div className="flex items-center bg-orange-100 dark:bg-orange-900 rounded-full px-4 py-2">
          <FaFireAlt className="text-orange-500 mr-2" />
          <span className="text-lg font-bold text-orange-800 dark:text-orange-100">{streakDays} day streak</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
        />
      </div>
    </motion.div>
  );
};

const QuoteSection = () => {
  const [quote, setQuote] = useState(Quotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * Quotes.length);
    setQuote(Quotes[randomIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white"
    >
      <div className="flex items-center mb-4">
        <FaQuoteLeft className="text-4xl text-indigo-200 mr-3" />
        <h3 className="text-2xl font-bold">Quote of the Moment</h3>
      </div>
      <blockquote className="text-xl italic mb-4">
        &quot;{quote.text}&quot;
      </blockquote>
      <p className="text-right text-indigo-200">- {quote.author}</p>
    </motion.div>
  );
};

const LearningStatsComp = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Learning Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6',
              }}
            />
            <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const QuickAccessTool = ({ name, icon: Icon, href, color }) => {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${color} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-300 text-white h-full`}
      >
        <Icon className="text-4xl mb-3" />
        <span className="text-lg font-bold text-center">{name}</span>
      </motion.div>
    </Link>
  );
};

const Achievements = () => {
  const achievements = [
    { icon: FaTrophy, title: 'First Quiz Ace', description: 'Score 100% on your first quiz', color: 'bg-yellow-500' },
    { icon: FaChartLine, title: 'Streak Master', description: 'Maintain a 7-day learning streak', color: 'bg-green-500' },
    { icon: FaBook, title: 'Chapter Conqueror', description: 'Complete your first chapter', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${achievement.color} rounded-lg p-6 text-white`}
          >
            <achievement.icon className="text-4xl mb-3" />
            <h3 className="font-bold text-xl mb-2">{achievement.title}</h3>
            <p className="text-sm opacity-80">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ComingSoonAchievements = comingSoon(Achievements);

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { progress, addXP, isLoaded: isProgressLoaded } = useProgress();
  const { learningStats, getCurrentSessionTime, getTotalMinutes, isLoaded: isStatsLoaded } = useLearningStats();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    if (isSignedIn && isUserLoaded && isProgressLoaded && isStatsLoaded) {
      setIsLoading(false);
    }
  }, [isUserLoaded, isProgressLoaded, isStatsLoaded, isSignedIn]);
  
  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Welcome to Your Learning Journey</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Sign up to access your personalized dashboard and start learning today!</p>
          <Link href="/signup" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 text-lg">
            Get Started
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-32 h-32 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Preparing your dashboard...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Learning Dashboard</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{greeting}, {user.firstName || 'Student'}!</p>
          </div>
          <Link href="/course">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 text-lg shadow-lg"
            >
              Continue Learning
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UserProgress {...progress} />
            <QuoteSection />
          </div>
          <div>
            <LearningStatsComp data={learningStats} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-6">Quick Access Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickAccessTools.map((tool, index) => (
              <QuickAccessTool key={index} {...tool} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <ComingSoonAchievements />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;