'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaBook, FaQuestionCircle } from 'react-icons/fa';
import { fetchRoadmap } from '@/components/fetchRaodmap';
import Spinner from '@/components/spinner'
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
  const [courseMap, setCourseMap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setIsLoading(true);
        const roadmap = await fetchRoadmap("Python Roadmap");
        if (roadmap && roadmap.data) {
          setCourseMap(roadmap.data);
        } else {
          setError("Roadmap data not found");
        }
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
        setError("Failed to fetch roadmap data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
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
