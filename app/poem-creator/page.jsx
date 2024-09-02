'use client';
import React, { useState } from 'react';

export default function PoemGenerator() {
    const [numLines, setNumLines] = useState(4);
    const [poemType, setPoemType] = useState('Haiku');
    const [rhymeScheme, setRhymeScheme] = useState('ABAB');
    const [theme, setTheme] = useState('');
    const [tone, setTone] = useState('Serene');
    const [poem, setPoem] = useState('');

    const generatePoem = async () => {
        if (theme.trim() === '') {
            alert("Please enter a theme before generating the poem.");
            return;
        }

        try {
            const response = await fetch('/api/poem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numLines,
                    poemType,
                    rhymeScheme,
                    theme,
                    tone,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPoem(data.text || 'No poem generated');
        } catch (error) {
            console.error('Error generating poem:', error);
            alert('Failed to generate poem.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                        Poem Generator
                    </h2>
                </div>

                <div className="flex flex-col space-y-4">
                    {/* Number of Lines */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 dark:text-gray-100">Number of Lines:</label>
                        <input
                            type="number"
                            value={numLines}
                            onChange={(e) => setNumLines(Number(e.target.value))}
                            className="w-20 p-2 border rounded"
                            min="1"
                            max="20"
                        />
                    </div>

                    {/* Type of Poem */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 dark:text-gray-100">Type of Poem:</label>
                        <select
                            value={poemType}
                            onChange={(e) => setPoemType(e.target.value)}
                            className="w-40 p-2 border rounded"
                        >
                            <option value="General">General</option>
                            <option value="Sonnet">Sonnet</option>
                            <option value="FreeVerse">Free Verse</option>
                            <option value="Limerick">Limerick</option>
                            <option value="Haiku">Haiku</option>
                            <option value="Acrostic">Acrostic</option>
                            <option value="Villanelle">Villanelle</option>
                            <option value="Elegy">Elegy</option>
                        </select>
                    </div>

                    {/* Rhyming Scheme */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 dark:text-gray-100">Rhyme Scheme:</label>
                        <select
                            value={rhymeScheme}
                            onChange={(e) => setRhymeScheme(e.target.value)}
                            className="w-40 p-2 border rounded"
                        >
                            <option value="ABAB">ABAB</option>
                            <option value="AABB">AABB</option>
                            <option value="ABBA">ABBA</option>
                            <option value="Free">Free</option>
                        </select>
                    </div>

                    {/* Theme */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 dark:text-gray-100">Theme:</label>
                        <input
                            type="text"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-40 p-2 border rounded"
                            placeholder="Enter your theme"
                        />
                    </div>

                    {/* Tone */}
                    <div className="flex justify-between items-center">
                        <label className="text-gray-900 dark:text-gray-100">Tone:</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-40 p-2 border rounded"
                        >
                            <option value="Serene">Serene</option>
                            <option value="Melancholic">Melancholic</option>
                            <option value="Joyful">Joyful</option>
                            <option value="Dramatic">Dramatic</option>
                        </select>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={generatePoem}
                            disabled={theme.trim() === ''}
                            className={`px-6 py-2 rounded-lg shadow-md ${theme.trim() === '' ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                        >
                            Generate Poem
                        </button>
                    </div>

                    {/* Display Generated Poem */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
                            Generated Poem
                        </h2>
                    </div>
                    <div className="flex-grow mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-auto">
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{poem}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
