'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock quiz data - in a real application, this would come from an API or database
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
  // Add more quizzes here...
};

export default function QuizPage({ params }) {
  const router = useRouter();
  const { slug } = params;
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (slug) {
      const quizData = quizzes[slug];
      if (quizData) {
        setQuiz(quizData);
      } else {
        // Handle case where quiz doesn't exist
        router.push('/404');
      }
    }
  }, [slug, router]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  if (!quiz) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {quiz.title}
          </h1>

          {!quizCompleted ? (
            <div>
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
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                      selectedAnswer === index
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion + 1 === quiz.questions.length ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Completed!</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Your score: {score} out of {quiz.questions.length}
              </p>
              <Link href="/resources" className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
                Back to Resources
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}