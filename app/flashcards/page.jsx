'use client';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle } from 'lucide-react';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcards/flashcard?id=${id}`);
    };

    const handleDeleteDeck = async (deckName) => {
        if (!user) return;
        setDeleteConfirmation(null);
        
        try {
            const batch = writeBatch(db);
            
            // Delete the deck from the user's flashcards array
            const userDocRef = doc(collection(db, 'users'), user.id);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const updatedFlashcards = userDocSnap.data().flashcards.filter(f => f.name !== deckName);
                batch.update(userDocRef, { flashcards: updatedFlashcards });
            }
    
            // Delete all cards in the deck
            const deckRef = collection(db, 'users', user.id, deckName);
            const querySnapshot = await getDocs(deckRef);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
    
            // Commit the batch
            await batch.commit();
    
            // Update local state
            setFlashcards(flashcards.filter(f => f.name !== deckName));
        } catch (error) {
            console.error("Error deleting deck:", error);
            // Handle the error (e.g., show an error message to the user)
        }
    };
    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }} className="bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1 
                    className="text-4xl font-extrabold text-center text-blue-800 mb-12"
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
                                className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center cursor-pointer"
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
                                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Study Now
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(flashcard.name)}
                                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                    >
                                        <Trash2 size={20} />
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
                            onClick={() => router.push('/flashcards/generate')}
                            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                            Create Your First Collection
                        </button>
                    </motion.div>
                )}
            </div>
            
            <AnimatePresence>
                {deleteConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-lg p-6 max-w-sm w-full"
                        >
                            <div className="flex items-center mb-4 text-red-500">
                                <AlertCircle size={24} className="mr-2" />
                                <h3 className="text-xl font-semibold">Delete Confirmation</h3>
                            </div>
                            <p className="mb-4">Are you sure you want to delete the &quot;{deleteConfirmation}&quot; deck? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setDeleteConfirmation(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteDeck(deleteConfirmation)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}