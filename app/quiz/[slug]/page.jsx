'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const quizzes = {
  'python-fundamentals-syntax-and-variables': {
    title: 'Python Fundamentals: Syntax and Variables',
    questions: [
      {
        id: 1,
        question: 'What symbol is used for comments in Python?',
        options: ['/', '//', '#', '/* */'],
        correctAnswer: 2
      },
      {
        id: 2,
        question: 'Which of the following is a valid variable name in Python?',
        options: ['2myVar', 'my-var', 'my_var', 'my var'],
        correctAnswer: 2
      },
      {
        id: 3,
        question: 'What is the output of print(type(42))?',
        options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'number\'>'],
        correctAnswer: 0
      }
    ]
  },
};

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

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const quizData = quizzes[slug];
        if (quizData) {
          setQuiz(quizData);
          setUserAnswers(new Array(quizData.questions.length).fill(null));
        } else {
          throw new Error('Quiz not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchQuiz();
    }
  }, [slug]);

  const handleAnswerSelect = (answerIndex) => {
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
      results: results
    };

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Quiz submission data:', submissionData);
      setQuizCompleted(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
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
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Your score: {score} out of {quiz.questions.length}
              </p>
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