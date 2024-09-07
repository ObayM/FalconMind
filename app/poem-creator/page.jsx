'use client'
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';

export default function PoemGenerator() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [poem, setPoem] = useState('');
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/signup');
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSubmit = async () => {
        if (!text.trim()) {
            setError('Please enter some text to generate a poem.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/poem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) {
                throw new Error('Failed to generate poem');
            }
            const data = await res.json();
            setPoem(data.poem);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error("Error generating poem:", error);
            setError('An error occurred while generating the poem. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            handleSubmit();
        }
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(poem).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }} className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold text-center text-blue-800 dark:text-blue-300 mb-8"
                >
                    Generate Poem
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
                >
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here... (Press Ctrl+Enter to generate)"
                        className="w-full h-40 p-4 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={handleKeyPress}
                    />
                    <motion.button
                        onClick={handleSubmit}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin mx-auto h-6 w-6" />
                        ) : (
                            <span className="flex items-center justify-center">
                                <Zap className="mr-2 h-5 w-5" />
                                Generate Poem
                            </span>
                        )}
                    </motion.button>
                    {error && (
                        <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{error}</p>
                    )}
                </motion.div>

                <AnimatePresence>
                    {poem && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12"
                        >
                            <h2 className="text-3xl font-semibold text-center text-blue-800 dark:text-blue-300 mb-6 pb-2 border-b-2 border-blue-200 dark:border-blue-700">
                                Your Generated Poem
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <p className="text-gray-800 dark:text-gray-200 text-lg whitespace-pre-wrap">
                                    <ReactMarkdown>{poem}</ReactMarkdown>
                                </p>
                            </div>
                            <div className="mt-8 flex flex-wrap justify-center space-x-4">
                                <motion.button
                                    onClick={copyToClipboard}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mb-4 bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-opacity-50 flex items-center"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-5 w-5" />
                                            Copy Poem
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                
            </div>
        </div>
    );
}