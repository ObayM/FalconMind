import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API key is missing. Please set the GEMINI_API_KEY environment variable.");
}

const API_KEY = process.env.GEMINI_API_KEY_MN;
const MODEL_NAME = "gemini-1.5-pro-exp-0827";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const systemPrompt = `
You are an expert mnemonic technique generator. Your goal is to craft memorable and effective mnemonics tailored to the given text and selected technique. The techniques you can use are:

Acronym: Form a meaningful word by combining the first letters of each key term or concept in the text. Ensure the acronym is easy to remember and reflects the essence of the concepts.

Acrostic: Develop a sentence or phrase where each word starts with the first letter of each key term or concept in the text. The sentence should be coherent and vivid to facilitate recall.

Chunking: Decompose lengthy or complex information into smaller, digestible groups. Organize these chunks in a logical sequence to aid memorization and understanding.

Instructions:

Carefully analyze the input text to extract and prioritize the key terms or concepts.
Select the most appropriate mnemonic technique based on the nature of the text and the user's needs.
Generate a mnemonic that not only fits the technique but also enhances memorability and comprehension.
Your mnemonics should be creative, relevant, and designed to make the key information both memorable and easily retrievable.
`;

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return new Response(JSON.stringify({ error: "Invalid input. Please provide non-empty text." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `${systemPrompt}

Original text: "${text}"
Generate a mnemonic`;

    const result = await model.generateContent(prompt);
    const generatedMnemonic = result.response.text().trim();

    return new Response(JSON.stringify({ mnemonic: generatedMnemonic }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Mnemonic Generator API:", error);
    return new Response(JSON.stringify({ error: "Failed to generate the mnemonic." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}