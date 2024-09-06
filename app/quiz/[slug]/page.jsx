'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuizData } from '@/components/QuizFirebase'; 
import { useUser } from '@clerk/nextjs';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { db } from '@/firebase';
import { useProgress } from '@/components/UserProgress';

export default function QuizPage({ params }) {
  const { slug } = params;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSignedIn, user } = useUser();
  const { progress, addXP } = useProgress();

  useEffect(() => {
    const fetchQuizAndCheckCompletion = async () => {
      setLoading(true);
      try {
        const quizData = await fetchQuizData(slug);
        setQuiz(quizData);

        if (user) {
          const db = getFirestore();
          const userQuizDocRef = doc(db, 'users', user.id, 'quizResults', slug);
          const userQuizDoc = await getDoc(userQuizDocRef);

          if (userQuizDoc.exists()) {
            setQuizCompleted(true);
            setScore(userQuizDoc.data().score);
            setUserAnswers(userQuizDoc.data().results.map(r => r.userAnswer));
          } else {
            setUserAnswers(new Array(quizData.questions.length).fill(null));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchQuizAndCheckCompletion();
    }
  }, [slug, user]);
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
  const handleAnswerSelect = (answerIndex) => {
    if (quizCompleted) return;
    setSelectedAnswer(answerIndex);
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = async () => {
    if (!user) {
      setError('User not authenticated. Please sign in to submit the quiz.');
      return;
    }

    const results = quiz.questions.map((question, index) => ({
      questionId: question.id,
      userAnswer: userAnswers[index],
      correctAnswer: question.correctAnswer,
      isCorrect: userAnswers[index] === question.correctAnswer
    }));

    const totalScore = results.filter(result => result.isCorrect).length;
    setScore(totalScore);

    const submissionData = {
      quizId: slug,
      score: totalScore,
      totalQuestions: quiz.questions.length,
      results: results,
      completedAt: new Date().toISOString()
    };

    try {
      setLoading(true);
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.id, 'quizResults', slug);
      await setDoc(userDocRef, submissionData);
      console.log('Quiz submission data stored in Firebase:', submissionData);
      
      // Calculate and add XP based on the score
      const xpGained = totalScore * 10; // 10 XP per correct answer
      await addXP(xpGained);
      
      setQuizCompleted(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error('Error storing quiz results:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <Link href="/course" className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {quiz.title}
          </h1>

          {!quizCompleted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {quiz.questions[currentQuestion].question}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                        selectedAnswer === index
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion + 1 === quiz.questions.length ? 'Submit Quiz' : 'Next Question'}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Your score: {score} out of {quiz.questions.length}
              </p>
              <p className="text-lg text-green-600 dark:text-green-400 mb-8">
                You earned {score * 10} XP!
              </p>
              {progress && (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Progress</p>
                  <p>Level: {progress.level}</p>
                  <p>XP: {progress.xp} / {progress.nextLevelXp}</p>
                  <p>Streak: {progress.streakDays} days</p>
                </div>
              )}
              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{question.question}</p>
                    <p className={`${userAnswers[index] === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      Your answer: {question.options[userAnswers[index]]}
                    </p>
                    {userAnswers[index] !== question.correctAnswer && (
                      <p className="text-green-600 dark:text-green-400 mt-1">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/course" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
                  Back to Course
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}