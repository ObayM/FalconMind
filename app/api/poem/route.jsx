import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API key is missing. Please set the GEMINI_API_KEY environment variable.");
}

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

const generationConfig = {
  temperature: 0.7,
  topK: 5,
  topP: 0.9,
  maxOutputTokens: 150,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig, safetySettings });

const systemContext = `
1. General Poem Generation: You are a poem generator. You respond only in poems. When given the number of lines, type of poem, rhyme scheme, theme, and tone, craft a poem that best fits the user’s request. Ensure your poem aligns with the specified details and is presented in the form requested.
2. Haiku Generation: You are a poem generator. Your responses are always in haiku form. When provided with the number of lines, theme, and tone, create a haiku that reflects these elements. Adhere strictly to the 5-7-5 syllable structure of a traditional haiku.
3. Sonnet Generation: You are a poem generator. Your responses are always in sonnet form. When given the number of lines, rhyme scheme, theme, and tone, craft a sonnet that captures the essence of the user's request. Follow the traditional 14-line structure and rhyme scheme of a sonnet.
4. Limerick Generation: You are a poem generator. You respond only in limericks. When provided with the number of lines, theme, and tone, create a limerick that fits the request. Ensure it adheres to the AABBA rhyme scheme and has a humorous or whimsical tone.
5. Free Verse Generation: You are a poem generator. Your responses are in free verse. When given the number of lines, theme, and tone, write a free verse poem that captures the essence of the user's request. There are no strict rules for rhyme or meter, but the poem should be expressive and aligned with the provided details.
6. Acrostic Poem Generation: You are a poem generator. You respond only in acrostic poems. When given the number of lines, theme, and tone, create an acrostic poem where the first letters of each line spell out a word or message related to the theme. Ensure the poem reflects the tone and theme provided.
7. Villanelle Generation: You are a poem generator. Your responses are in villanelle form. When provided with the number of lines, rhyme scheme, theme, and tone, craft a villanelle that fits the request. Adhere to the 19-line structure and the specific repeating lines and rhyme scheme of a villanelle.
8. Elegy Generation: You are a poem generator. You respond only in elegies. When given the number of lines, theme, and tone, create an elegy that reflects these elements. An elegy should express sorrow or lamentation and be aligned with the user’s specifications.
`;

const roleMapping = {
    general: 'General Generation',
    haiku: 'Haiku Generation',
    sonnet: 'Sonnet Generation',
    limerick: 'Limerick Generation',
    freeverse: 'Free Verse Generation',
    acrostic: 'Acrostic Poem Generation',
    villanelle: 'Villanelle Generation',
    elegy: 'Elegy Generation',
};

export async function POST(req) {
  try {
    const { numLines, poemType, rhymeScheme, theme, tone } = await req.json();

    
    const normalizedPoemType = poemType.toLowerCase().replace(/\s+/g, '');

    
    if (typeof numLines !== 'number' || numLines <= 0 || !theme.trim() || !normalizedPoemType || !rhymeScheme || !tone) {
      return new Response(JSON.stringify({ error: "Invalid input data. Ensure all fields are provided and valid." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const role = roleMapping[normalizedPoemType];
    if (!role) {
      return new Response(JSON.stringify({ error: "Invalid poem type provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `${systemContext}\nWrite a ${numLines}-line ${role} with a ${rhymeScheme} rhyme scheme. The theme is "${theme}" and the tone should be ${tone}.`;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (apiError) {
      if (apiError.message.includes('429')) {
        console.error("Rate limit exceeded. Please try again later.");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        throw apiError;
      }
    }

    return new Response(JSON.stringify({ text: result.response.text() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Poem Generator API route:", error.message);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate the poem." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
