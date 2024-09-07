'use client'
import { useState, useEffect, useRef } from "react";
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [isAIOnline, setIsAIOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          history: messages.map((msg) => ({
            text: msg.text,
            role: msg.role === "bot" ? "model" : "user",
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const result = await response.json();
      const botMessage = {
        text: result.text,
        role: "bot",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsAIOnline(true);
      setError(null);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      setIsAIOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-4 px-4 sm:px-6 lg:px-8 flex items-end">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col h-[calc(100vh-128px)]">
        <div className="px-6 py-4 sm:px-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Falco AI Chat</h2>
          </div>
        </div>
        <div 
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto px-6 sm:px-8 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200 dark:scrollbar-thumb-indigo-400 dark:scrollbar-track-gray-700"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-4 rounded-lg shadow-md ${
                  message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                <div className="prose dark:prose-invert max-w-none " dir="auto">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && <LoadingSpinner />}
        </div>
        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center">
            <textarea
              ref={inputRef}
              className="flex-grow border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-indigo-600 dark:text-white rounded-lg shadow-sm py-2 px-4 resize-none"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              dir="auto"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200 flex-shrink-0 disabled:opacity-50"
              disabled={isLoading || !userInput.trim()}
            >
              <FiSend className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}