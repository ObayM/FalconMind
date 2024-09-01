'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaBook } from 'react-icons/fa';

const SubskillLink = ({ subskill, moduleName }) => {
    const conceptSlug = `${moduleName.toLowerCase().replace(/\s+/g, '-')}-${subskill.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <Link href={`/concept/${conceptSlug}`}>
        <div className="flex items-center p-3 rounded-md transition-all duration-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 group">
          <span className={`w-3 h-3 rounded-full mr-3 transition-colors duration-300 ${
            subskill.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-500'
          }`}></span>
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
            {subskill.name}
          </span>
        </div>
      </Link>
    );
  };

const CourseModule = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const icons = [FaBook];
  const IconComponent = icons[index % icons.length];

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 rounded-full">
              <IconComponent className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{module.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>
            </div>
          </div>
          <button
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors duration-300"
          >
            {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </button>
        </div>
      </div>
      {isOpen && module.subskills && module.subskills.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
    <div className="bg-indigo-600 h-2.5 rounded-full dark:bg-indigo-500" style={{ width: `${progress}%` }}></div>
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
    <div className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-4">
        Python Course
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Knowledge is the key that opens every door of opportunity.
      </p>
      <ProgressBar progress={progress} />
      <div className="max-w-4xl mx-auto space-y-8">
        {courseMap.map((module, index) => (
          <CourseModule key={index} module={module} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;