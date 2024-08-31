'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
    const flashcards = [
        {name : '1st one', description : 'description1', flashcards: [{front: "hi1", back: "hello1"},{front: "hi11", back: "hello11"}]},
        {name : '2nd one', description : 'description2', flashcards: [{front: "hi2", back: "hello2"},{front: "hi22", back: "hello22"}]},
        {name : '3rd one', description : 'description3', flashcards: [{front: "hi3", back: "hello3"},{front: "hi33", back: "hello33"}]},
    
    ]

    const handleCardClick = (id) => {
        router.push(`/deck?id=${id}`);
    };



    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }} className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    className="text-4xl font-extrabold text-center text-indigo-800 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Your Flashcard Collections
                </motion.h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {flashcards.map((flashcard, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg relative"
                        >
                            <div 
                                className="h-48 bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center cursor-pointer"
                                onClick={() => handleCardClick(flashcard.name)}
                            >
                                <h2 className="text-2xl font-bold text-white text-center px-4">
                                    {flashcard.name}
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-4">
                                    {flashcard.description || "No description available"}
                                </p>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleCardClick(flashcard.name)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                        Study Now
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                    >
                                        Delete

                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {flashcards.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mt-12"
                    >
                        <p className="text-xl text-gray-600">You don&apos;t have any flashcard collections yet.</p>
                        <button
                            onClick={() => router.push('/generate')}
                            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
                        >
                            Create Your First Collection
                        </button>
                    </motion.div>
                )}
            </div>

        </div>
    );
}