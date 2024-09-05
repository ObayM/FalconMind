'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "@/firebase";
import { useUser } from '@clerk/nextjs';

const ProgressContext = createContext();

export const UserProgressProvider = ({ children }) => {
  const { user } = useUser();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (user) {
      initializeOrUpdateProgress();
    }
  }, [user]);

  const initializeOrUpdateProgress = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.id);

    try {
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (!userData.progress) {
          await setDoc(userRef, { 
            progress: {
              level: 1,
              xp: 0,
              nextLevelXp: 1000,
              streakDays: 0,
              lastUpdate: serverTimestamp()
            }
          }, { merge: true });
        } else {
          await updateProgress(userRef, userData.progress);
        }
      } else {
        await setDoc(userRef, {
          progress: {
            level: 1,
            xp: 0,
            nextLevelXp: 1000,
            streakDays: 0,
            lastUpdate: serverTimestamp()
          }
        });
      }

      const updatedDocSnap = await getDoc(userRef);
      if (updatedDocSnap.exists()) {
        setProgress(updatedDocSnap.data().progress);
      }
    } catch (error) {
      console.error('Error initializing or updating progress:', error);
    }
  };

  const updateProgress = async (userRef, currentProgress) => {
    const now = new Date();
    const lastUpdate = currentProgress.lastUpdate.toDate();
    
    const isNewDay = now.toDateString() !== lastUpdate.toDateString();
    
    if (isNewDay) {
      const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
      const newStreakDays = daysSinceLastUpdate === 1 ? currentProgress.streakDays + 1 : 1;
      
      await setDoc(userRef, { 
        progress: {
          ...currentProgress,
          streakDays: newStreakDays,
          lastUpdate: serverTimestamp()
        }
      }, { merge: true });
    }
  };

  const addXP = async (xpAmount) => {
    if (!user || !progress) return;

    const userRef = doc(db, 'users', user.id);

    let newXP = progress.xp + xpAmount;
    let newLevel = progress.level;
    let newNextLevelXp = progress.nextLevelXp;

    while (newXP >= newNextLevelXp) {
      newXP -= newNextLevelXp;
      newLevel++;
      newNextLevelXp = Math.round(newNextLevelXp * 1.5);
    }

    const updatedProgress = {
      ...progress,
      xp: newXP,
      level: newLevel,
      nextLevelXp: newNextLevelXp,
      lastUpdate: serverTimestamp()
    };

    try {
      await setDoc(userRef, { progress: updatedProgress }, { merge: true });
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, addXP }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);