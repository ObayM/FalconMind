'use client'
import React, { useState, useEffect } from 'react';
import { storeLessonInFirebase } from '@/components/StoreLesson';
import { storeQuizData } from '@/components/QuizFirebase';

export default async function Home() {

  
  // const lessonData = {
  //   name: 'python-fundamentals-syntax-and-variables',
  //   title: 'Syntax and Variables In Python',
  //   content: `  
  //   Python is a high-level programming language renowned for its simplicity and readability. Understanding its syntax and variables is fundamental for anyone starting out with Python.
  
  //   ## Basic Syntax
    
  //   Python uses indentation to define code blocks. Here's a simple example:
    
  //   \`\`\`python
  //   if True:
  //       print("This is indented")
  //   print("This is not indented")
  //   \`\`\`
    
  //   ## Variables
    
  //   Variables in Python are created when you assign a value to them:
    
  //   \`\`\`python
  //   x = 5
  //   y = "Hello, World!"
  //   \`\`\`
    
  //   Python is dynamically typed, which means you don't need to declare the type of a variable.
  //       `,
  //   resources: [
  //     { title: 'Python Documentation', url: 'https://docs.python.org/3/' },
  //     { title: 'Python Tutorial', url: 'https://youtu.be/4WVZBtqqVM4?si=k29TAj-2ub3uMtdT' }
  //   ]
  // };
  
  // await storeLessonInFirebase(lessonData);
  // try {
  //   await storeQuizData('python-fundamentals-syntax-and-variables', {
  //     title: 'Python Fundamentals: Syntax and Variables',
  //     questions: [
        
  //         {
  //           id: 1,
  //           question: 'What symbol is used for comments in Python?',
  //           options: ['/', '//', '#', '/* */'],
  //           correctAnswer: 2
  //         },
  //         {
  //           id: 2,
  //           question: 'Which of the following is a valid variable name in Python?',
  //           options: ['2myVar', 'my-var', 'my_var', 'my var'],
  //           correctAnswer: 2
  //         },
  //         {
  //           id: 3,
  //           question: 'What is the output of print(type(42))?',
  //           options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'number\'>'],
  //           correctAnswer: 0
  //         }
        
  //     ]
  //   });
  //   console.log('Quiz data stored successfully');
  // } catch (error) {
  //   console.error('Error storing quiz data:', error);
  // }
  
  return (
    <>
      
    </>
  );
}
