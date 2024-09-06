'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBook, FaRobot, FaFeather, FaQuoteLeft, FaComments, FaChartLine, FaTrophy, FaFireAlt, FaClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/nextjs';
import { useProgress } from '@/components/UserProgress';
import { useLearningStats } from '@/components/LearningStats';


// Mock data for the dashboard
const mockUserData = {
  level: 7,
  xp: 3200,
  nextLevelXp: 5000,
  streakDays: 12,
};

const mockLearningStats = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 60 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 75 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 40 },
];

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
  { name: 'AI Flashcards', icon: FaRobot, href: '/flashcards' },
  { name: 'Poem Generator', icon: FaFeather, href: '/poem-creator' },
  { name: 'AI Assistant', icon: FaComments, href: '/ai-assistant' },
];


const comingSoon = (WrappedComponent) => {
  return function WithComingSoon(props) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <FaClock className="text-4xl text-indigo-500 mb-2 mx-auto" />
            <p className="text-lg font-semibold text-center">Coming Soon!</p>
          </div>
        </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Level {level}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{xp} / {nextLevelXp} XP</p>
        </div>
        <div className="flex items-center">
          <FaFireAlt className="text-orange-500 mr-2" />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{streakDays} day streak</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const QuoteSection = () => {
  const [quote, setQuote] = useState(Quotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * Quotes.length);
    setQuote(Quotes[randomIndex]);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <FaQuoteLeft className="text-3xl text-indigo-500 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Quote of the Moment</h3>
      </div>
      <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
      &quot;{quote.text}&quot;
      </blockquote>
      <p className="text-right text-gray-600 dark:text-gray-400">- {quote.author}</p>
    </div>
  );
};

const LearningStatsComp = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Learning Activity</h3>
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
            <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const QuickAccessTool = ({ name, icon: Icon, href }) => {
  return (
    <Link href={href} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:transform hover:scale-105">
      <Icon className="text-3xl mb-2 text-indigo-500" />
      <span className="text-sm font-medium text-center text-gray-800 dark:text-gray-200">{name}</span>
    </Link>
  );
};

const Achievements = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <FaTrophy className="text-3xl text-yellow-500 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">First Quiz Ace</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Score 100% on your first quiz</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
          <FaChartLine className="text-3xl text-green-500 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Streak Master</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Maintain a 7-day learning streak</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <FaBook className="text-3xl text-purple-500 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Chapter Conqueror</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Complete your first chapter</p>
          </div>
        </div>
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

    // Check if all data is loaded
    if (isUserLoaded && isProgressLoaded && isStatsLoaded) {
      setIsLoading(false);
    }
  }, [isUserLoaded, isProgressLoaded, isStatsLoaded]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Please sign in to view your dashboard</h2>
          <Link href="/sign-in" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{greeting}, {user.firstName || 'Student'}!</p>
          </div>
          <Link href="/course" className="mt-4 sm:mt-0 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Go to Course
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserProgress {...progress} />
            <QuoteSection />
          </div>
          <div>
            <LearningStatsComp data={learningStats} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Access Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickAccessTools.map((tool, index) => (
              <QuickAccessTool key={index} {...tool} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <ComingSoonAchievements />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;