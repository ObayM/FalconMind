import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your goal is to generate concise, clear, and informative flashcards based on the input provided. 
Each flashcard should contain:

1. A Question (or Term) on the front.
2. An Answer (or Definition) on the back.

Guidelines:
- Keep questions and answers brief and to the point.
- Use simple language and avoid jargon unless necessary.
- Ensure accuracy and relevance in each flashcard.
- When applicable, include examples to clarify concepts.
- Tailor the difficulty level of the flashcards to the intended audience.

Return the flashcards in the following JSON format, and nothing else:
{
    "flashcards": [{
        "front": "string", 
        "back": "string"
    }]
}
`;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    });
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data },
        ],
        model: "meta-llama/llama-3.1-8b-instruct:free",
    });

    const rawResponse = completion.choices[0].message.content;
    console.log('Raw response:', rawResponse); // Log the raw response

    let flashcards;
    try {
        flashcards = JSON.parse(rawResponse);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return NextResponse.json({ error: 'Invalid JSON response from OpenAI', rawResponse }, { status: 500 });
    }

    return NextResponse.json(flashcards.flashcards);
}