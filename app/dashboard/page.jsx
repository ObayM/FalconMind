'use client'
import React from 'react';
import Link from 'next/link';
import { FaBook, FaQuestionCircle, FaRoad, FaClipboardCheck } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressTracker = ({ current, total }) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-sm font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold inline-block text-indigo-600 dark:text-indigo-300">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-700">
          <div 
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-300 transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>
    </div>
  );
};

const DailyProgressChart = ({ data }) => {
  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
          <Bar dataKey="timeSpent" fill="#0D9488" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  const stats = [
    { label: 'Lessons Completed', value: 42, icon: FaBook },
    { label: 'Time Spent Learning', value: '36h 20m', icon: FaClipboardCheck },
    { label: 'Average Quiz Score', value: '85%', icon: FaQuestionCircle },
  ];

  const buttons = [
    { label: 'Resources', icon: FaBook, href: '/resources' },
    { label: 'Quizzes', icon: FaQuestionCircle, href: '/quizzes' },
    { label: 'Roadmap', icon: FaRoad, href: '/roadmap' },
    { label: 'Review Study', icon: FaClipboardCheck, href: '/review' },
  ];

  const dailyProgressData = [
    { day: 'Mon', timeSpent: 2 },
    { day: 'Tue', timeSpent: 3 },
    { day: 'Wed', timeSpent: 1.5 },
    { day: 'Thu', timeSpent: 4 },
    { day: 'Fri', timeSpent: 2.5 },
    { day: 'Sat', timeSpent: 3.5 },
    { day: 'Sun', timeSpent: 1 },
  ];

  return (
    <div style={{minHeight: 'calc(100vh - 64px)'}} className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-600 dark:text-indigo-300">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>
            <ProgressTracker current={50} total={100} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Daily Progress</h2>
            <DailyProgressChart data={dailyProgressData} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                <stat.icon className="text-3xl mr-4 text-indigo-500 dark:text-indigo-300" />
                <div>
                  <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">{stat.label}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:transform hover:scale-105"
              >
                <button.icon className="text-4xl mb-3 text-indigo-500 dark:text-indigo-300" />
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{button.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;