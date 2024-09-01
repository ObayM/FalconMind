"use client";
import { useState, useEffect, useRef } from "react";
import { FiSend } from 'react-icons/fi';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [isAIOnline, setIsAIOnline] = useState(true);
  const inputRef = useRef(null);
  const endOfMessagesRef = useRef(null); // Reference for the end of the messages

  const handleSendMessage = async () => {
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
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Falco AI Chat</h2>
          </div>
          <div className="h-96 overflow-y-auto mb-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-lg shadow-md ${
                    message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} /> {/* Reference to scroll to */}
          </div>
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-indigo-600 dark:text-white rounded-lg shadow-sm py-2 px-4"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors duration-200"
            >
              <FiSend className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
