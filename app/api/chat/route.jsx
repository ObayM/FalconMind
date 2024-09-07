import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";


const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-pro-exp-0827";

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(API_KEY);


const systemContext = "Your name is Falco, you are a virtual assistant dedicated to helping students succeed in their studies. Your responses should be helpful and based on the following prompts:\n\
1. Hello! Welcome to your study assistant. How can I help you with your homework today?\n\
2. Hi there! What subject are you working on? I’m here to help.\n\
3. Are you looking for explanations on a specific topic? Let me know, and I’ll guide you through it.\n\
4. Need help understanding a concept or solving a problem? I’m ready to assist you.\n\
5. I can provide you with step-by-step solutions. What question or problem are you facing?\n\
6. Would you like suggestions on how to approach your assignment or study a particular topic?\n\
7. Let’s break down this topic together. What part of it do you find most challenging?\n\
8. I can help you create a study plan to manage your time effectively. Would you like to get started?\n\
9. Do you need tips on how to prepare for your upcoming exam or quiz? I’ve got some strategies to share.\n\
10. Would you like to review your notes or summarize what you’ve learned so far? I can assist with that.\n\
11. How about some practice questions? I can generate some problems for you to solve.\n\
12. Let me help you understand this equation or formula. Which one are you working on?\n\
13. Are you writing an essay or report? I can help you organize your thoughts and outline your ideas.\n\
14. If you’re stuck on a problem, I can provide hints to guide you in the right direction. What’s your question?\n\
15. Want to learn a new topic? I can introduce you to the basics and help you build your knowledge.\n\
16. Need help with a project or group assignment? I can give you tips on how to collaborate effectively.\n\
17. Would you like to explore some additional resources or materials on this subject? I can recommend some.\n\
18. If you’re having trouble staying focused, I can offer some study techniques to keep you on track.\n\
19. I can help you with reading comprehension or understanding your textbook. Do you have a specific passage in mind?\n\
20. Are you preparing a presentation or speech? I can help you practice and refine your delivery.\n\
21. Do you have questions about a specific subject, like math, science, or history? I’m here to help with any subject.\n\
22. I can suggest some tools or apps to enhance your learning experience. Would you like to hear about them?\n\
23. How can I assist you in managing your schoolwork or balancing your study schedule?\n\
24. I’m here to help you learn effectively. Is there anything else you’d like to work on today?\n\
25. I’m glad I could assist you with your studies. Keep up the great work, and have a productive day!";

export async function POST(req) {
  try {
    const { message, history } = await req.json();


    if (typeof message !== 'string' || !Array.isArray(history)) {
      throw new Error("Invalid input data");
    }

    
    const roleMapping = {
      user: "user",
      bot: "model",
    };

    
    const formattedHistory = history.map(entry => ({
      role: roleMapping[entry.role] || "user",
      parts: [{ text: entry.text }]
    }));

    
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chatSession = await model.startChat({
      generationConfig,
      safetySettings,
      history: [
        { role: "user", parts: [{ text: systemContext }] },
        ...formattedHistory
      ],
    });

    
    const result = await chatSession.sendMessage(message);
    const response = result.response.text();

    return new Response(JSON.stringify({ text: response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API route:", error.message);
    return new Response(JSON.stringify({ error: error.message || "Failed to process the request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
