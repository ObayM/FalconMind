'use client'
import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2, Copy, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';

export default function MnemonicGenerator() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [inputText, setInputText] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/signup');
        }
    }, [isLoaded, isSignedIn, router]);

    const generateMnemonic = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to generate a mnemonic.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await fetch('/api/mnemonic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate mnemonic');
            }

            const data = await response.json();
            setMnemonic(data.mnemonic);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error("Error generating mnemonic:", error);
            setError('An error occurred while generating the mnemonic. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault();
            generateMnemonic();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonic).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }} className="bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold text-center text-indigo-800 dark:text-indigo-300 mb-8"
                >
                    Generate Mnemonic
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
                >
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter your text here... (Press Ctrl+Enter to generate)"
                        className="w-full h-40 p-4 border border-indigo-300 dark:border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyPress={handleKeyPress}
                    />
                    <motion.button
                        onClick={generateMnemonic}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin mx-auto h-6 w-6" />
                        ) : (
                            <span className="flex items-center justify-center">
                                <Zap className="mr-2 h-5 w-5" />
                                Generate Mnemonic
                            </span>
                        )}
                    </motion.button>
                    {error && (
                        <p className="mt-2 text-red-500 dark:text-red-400 text-sm">{error}</p>
                    )}
                </motion.div>

                <AnimatePresence>
                    {mnemonic && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12"
                        >
                            <h2 className="text-3xl font-semibold text-center text-indigo-800 dark:text-indigo-300 mb-6 pb-2 border-b-2 border-indigo-200 dark:border-indigo-700">
                                Your Generated Mnemonic
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                                <p className="text-gray-800 dark:text-gray-200 text-lg whitespace-pre-wrap">
                                    <ReactMarkdown>{mnemonic}</ReactMarkdown>
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
                                            Copy Mnemonic
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