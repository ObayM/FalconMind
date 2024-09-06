'use client';

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { Loader2, Save, X, Copy, Trash2, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSubmit = async () => {
        if (!text.trim()) {
            setError('Please enter some text to generate flashcards.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) {
                throw new Error('Failed to generate flashcards');
            }
            const data = await res.json();
            setFlashcards(data);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } catch (error) {
            console.error("Error generating flashcards:", error);
            setError('An error occurred while generating flashcards. Please try again.');
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

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const saveFlashcards = async () => {
        if (!name) {
            setError('Please enter a name for your flashcard collection.');
            return;
        }

        setLoading(true);
        try {
            const batch = writeBatch(db);
            const userDocRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                if (collections.find((f) => f.name === name)) {
                    throw new Error('A flashcard collection with this name already exists.');
                } else {
                    collections.push({ name, createdAt: new Date() });
                    batch.set(userDocRef, { flashcards: collections }, { merge: true });
                }
            } else {
                batch.set(userDocRef, { flashcards: [{ name, createdAt: new Date() }] });
            }

            const colRef = collection(userDocRef, name);
            flashcards.forEach((flashcard, index) => {
                const cardDocRef = doc(colRef);
                batch.set(cardDocRef, { ...flashcard, order: index });
            });

            await batch.commit();
            handleClose();
            router.push('/flashcards');
        } catch (error) {
            console.error("Error saving flashcards:", error);
            setError(error.message || 'An error occurred while saving the flashcards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const flashcardsText = flashcards.map(card => `Q: ${card.front}\nA: ${card.back}`).join('\n\n');
        navigator.clipboard.writeText(flashcardsText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const deleteFlashcard = (index) => {
        setFlashcards(cards => cards.filter((_, i) => i !== index));
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }} className="bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold text-center text-blue-800 mb-8"
                >
                    Generate Flashcards
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg p-6 mb-8"
                >
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here... (Press Ctrl+Enter to generate)"
                        className="w-full h-40 p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onKeyPress={handleKeyPress}
                    />
                    <motion.button
                        onClick={handleSubmit}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin mx-auto h-6 w-6" />
                        ) : (
                            <span className="flex items-center justify-center">
                                <Zap className="mr-2 h-5 w-5" />
                                Generate Flashcards
                            </span>
                        )}
                    </motion.button>
                    {error && (
                        <p className="mt-2 text-red-500 text-sm">{error}</p>
                    )}
                </motion.div>

                <AnimatePresence>
                    {flashcards.length > 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12"
                        >
                            <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6 pb-2 border-b-2 border-blue-200">
                                Flashcards Preview
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {flashcards.map((flashcard, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative h-64 w-full perspective group"
                                    >
                                        <div
                                            className={`absolute inset-0 w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${
                                                flipped[index] ? 'rotate-y-180' : ''
                                            }`}
                                            onClick={() => handleCardClick(index)}
                                        >
                                            <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-6 flex items-center justify-center rounded-xl shadow-lg">
                                                <p className="text-white text-xl font-semibold text-center">
                                                    {flashcard.front}
                                                </p>
                                            </div>
                                            <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-400 to-pink-500 p-6 flex items-center justify-center rounded-xl shadow-lg rotate-y-180">
                                                <p className="text-white text-xl font-semibold text-center">
                                                    {flashcard.back}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => deleteFlashcard(index)}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-8 flex flex-wrap justify-center space-x-4">
                                <motion.button
                                    onClick={handleOpen}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    Save Collection
                                </motion.button>
                                <motion.button
                                    onClick={copyToClipboard}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mb-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-5 w-5" />
                                            Copy All
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-lg p-6 w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-semibold text-blue-800">Save Flashcards</h3>
                                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Please enter a name for your flashcards collection.
                            </p>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Collection Name"
                                className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                            />
                            <div className="flex justify-end space-x-2">
                                <motion.button
                                    onClick={handleClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={saveFlashcards}
                                    disabled={loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    Save
                                </motion.button>
                            </div>
                            {error && (
                                <p className="mt-2 text-red-500 text-sm">{error}</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}