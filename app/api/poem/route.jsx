import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY_POEM;
const MODEL_NAME = "gemini-1.5-pro-exp-0827";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const systemPrompt = `

You are a specialized poem generator focused on crafting memorable and concise poems from provided texts. Your tasks are:

Analyze the Input Text: Carefully examine the text to identify key concepts, themes, and essential information.

Create a Short, Rhyming Poem: Compose a poem that succinctly encapsulates the main ideas, ensuring it has a clear rhyme scheme.

Use Memory Enhancing Techniques: Incorporate mnemonic devices such as alliteration, rhythm, and imagery to make the poem easy to remember.

Capture the Essence Concisely: Keep the poem brief and focused, conveying the core message without unnecessary details.

Match the Text's Language: Ensure the poem is written in the same language as the input text.

Additional Guidelines:

Maintain clarity and coherence throughout the poem.
Engage the reader with vivid language and compelling expressions.
Ensure the poem stands alone in conveying the original text's essence without requiring additional context.
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

    const prompt = `${systemPrompt}\n\nOriginal text: "${text}"\n\nGenerate a memorable poem based on this text:`;

    const result = await model.generateContent(prompt);
    const generatedPoem = result.response.text().trim();

    return new Response(JSON.stringify({ poem: generatedPoem }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Memorable Poem Generator API:", error);
    return new Response(JSON.stringify({ error: "Failed to generate the poem." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}