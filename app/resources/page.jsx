'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaBook, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';

const SubskillLink = ({ subskill, moduleName }) => {
  const conceptSlug = `${moduleName.toLowerCase().replace(/\s+/g, '-')}-${subskill.name.toLowerCase().replace(/\s+/g, '-')}`;
  const quizSlug = `quiz/${conceptSlug}`;
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 group">
      <Link href={`/concept/${conceptSlug}`} className="flex-grow">
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-4 transition-colors duration-300 ${
            subskill.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-500'
          }`}></span>
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300 font-medium">
            {subskill.name}
          </span>
        </div>
      </Link>
      <Link 
        href={quizSlug}
        className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
        title={`Take quiz for ${subskill.name}`}
      >
        <FaQuestionCircle size={20} />
      </Link>
    </div>
  );
};

const CourseModule = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const icons = [FaBook];
  const IconComponent = icons[index % icons.length];

  const completedSubskills = module.subskills.filter(subskill => subskill.completed).length;
  const totalSubskills = module.subskills.length;
  const progress = Math.round((completedSubskills / totalSubskills) * 100);

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 rounded-full">
              <IconComponent className="text-indigo-600 dark:text-indigo-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">{module.name}</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {completedSubskills}/{totalSubskills} completed
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1 dark:bg-gray-700">
                <div className="bg-indigo-600 h-2.5 rounded-full dark:bg-indigo-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <button
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors duration-300"
            >
              {isOpen ? <FaChevronUp size={24} /> : <FaChevronDown size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && module.subskills && module.subskills.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.subskills.map((subskill, subIndex) => (
              <SubskillLink key={subIndex} subskill={subskill} moduleName={module.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 mb-6 dark:bg-gray-700">
    <div className="bg-indigo-600 h-3 rounded-full dark:bg-indigo-500 transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
  </div>
);

const ResourcesPage = () => {
  const courseMap = [
    {
      "name": "Python Fundamentals",
      "description": "Master the core concepts of Python before diving into advanced topics",
      "completed": false,
      "subskills": [
          {"name": "Syntax and Variables", "completed": true},
          {"name": "Data Types", "completed": false},
          {"name": "Control Flow (if, else, loops)", "completed": false},
          {"name": "Functions", "completed": false},
          {"name": "Modules and Packages", "completed": false}
      ]
  },
  {
      "name": "Advanced Python",
      "description": "Dive into more complex Python concepts",
      "completed": false,
      "subskills": [
          {"name": "Object-Oriented Programming", "completed": false},
          {"name": "File Handling", "completed": false},
          {"name": "Error Handling", "completed": false},
          {"name": "Iterators and Generators", "completed": false},
          {"name": "Decorators", "completed": false}
      ]
  },
  {
      "name": "Python for Data Science",
      "description": "Apply Python to data science tasks and libraries",
      "completed": false,
      "subskills": [
          {"name": "NumPy", "completed": false},
          {"name": "Pandas", "completed": false},
          {"name": "Matplotlib and Seaborn", "completed": false},
          {"name": "Scikit-learn", "completed": false},
          {"name": "Data Cleaning and Preprocessing", "completed": false}
      ]
  },
  {
      "name": "Web Development with Python",
      "description": "Learn how to use Python for web development",
      "completed": false,
      "subskills": [
          {"name": "Flask Basics", "completed": false},
          {"name": "Django Basics", "completed": false},
          {"name": "APIs with Flask and Django", "completed": false},
          {"name": "Templating with Jinja2", "completed": false},
          {"name": "Database Integration", "completed": false}
      ]
  },
  {
      "name": "Python Automation",
      "description": "Automate tasks using Python scripts",
      "completed": false,
      "subskills": [
          {"name": "Working with Files and Directories", "completed": false},
          {"name": "Web Scraping with BeautifulSoup", "completed": false},
          {"name": "Task Scheduling", "completed": false},
          {"name": "Automating Emails and Reports", "completed": false},
          {"name": "Interacting with APIs", "completed": false}
      ]
  }]
  const totalSubskills = courseMap.reduce((acc, module) => acc + module.subskills.length, 0);
  const completedSubskills = courseMap.reduce((acc, module) => 
    acc + module.subskills.filter(subskill => subskill.completed).length, 0
  );
  const progress = Math.round((completedSubskills / totalSubskills) * 100);

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-4">
        Python Mastery Course
      </h1>
      <p className="text-center text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
        Embark on a journey to Python excellence. Every concept mastered is a step towards becoming a proficient developer.
      </p>
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Overall Progress</h2>
        <ProgressBar progress={progress} />
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{completedSubskills} of {totalSubskills} subskills completed</span>
          <span>{progress}% complete</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {courseMap.map((module, index) => (
          <CourseModule key={index} module={module} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
