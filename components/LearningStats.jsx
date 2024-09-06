'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'learningStats';
const UPDATE_INTERVAL = 60000; // 1 minute in milliseconds

const LearningStatsContext = createContext();

export const LearningStatsProvider = ({ children }) => {
  const [learningStats, setLearningStats] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [secondsCount, setSecondsCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadStats();
    setupVisibilityListener();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsCount((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && secondsCount !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsCount]);

  useEffect(() => {
    if (secondsCount > 0 && secondsCount % 60 === 0) {
      updateMinutes(1);
    }
  }, [secondsCount]);

  const setupVisibilityListener = () => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const loadStats = () => {
    const storedStats = localStorage.getItem(STORAGE_KEY);
    if (storedStats) {
      setLearningStats(JSON.parse(storedStats));
    } else {
      const initialStats = [
        { day: 'Mon', minutes: 0 },
        { day: 'Tue', minutes: 0 },
        { day: 'Wed', minutes: 0 },
        { day: 'Thu', minutes: 0 },
        { day: 'Fri', minutes: 0 },
        { day: 'Sat', minutes: 0 },
        { day: 'Sun', minutes: 0 },
      ];
      setLearningStats(initialStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats));
    }
    setIsLoaded(true);
  };

  const updateMinutes = useCallback((minutes) => {
    const today = new Date().toLocaleString('en-us', {weekday: 'short'});
    setLearningStats(prevStats => {
      const updatedStats = prevStats.map(stat => 
        stat.day === today ? { ...stat, minutes: stat.minutes + minutes } : stat
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
      return updatedStats;
    });
  }, []);

  const getTotalMinutes = useCallback(() => {
    return learningStats.reduce((total, day) => total + day.minutes, 0);
  }, [learningStats]);

  const getCurrentSessionTime = useCallback(() => {
    const minutes = Math.floor(secondsCount / 60);
    const seconds = secondsCount % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [secondsCount]);

  return (
    <LearningStatsContext.Provider value={{ 
      learningStats, 
      updateMinutes, 
      getTotalMinutes, 
      getCurrentSessionTime,
      isLoaded 
    }}>
      {children}
    </LearningStatsContext.Provider>
  );
};

export const useLearningStats = () => useContext(LearningStatsContext);