# FalconMind

FalconMind is an AI-powered learning platform that offers personalized content, interactive roadmaps, and dynamic learning experiences.

## Features

- AI-generated flashcards and mnemonics
- Personalized learning roadmaps
- Interactive quizzes
- User progress tracking
- Dark mode support
- Responsive design

## Tech Stack

- Frontend: Next.js, React
- Styling: Tailwind CSS, Framer Motion
- Backend: Firebase
- Authentication: Clerk
- AI Integration: OpenAI API, Google Generative AI
- Deployment: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ObayM/FalconMind.git
   cd FalconMind
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
      NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
      NEXT_PUBLIC_GEMINI_API_KEY_MN=your_gemini_api_key NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
   ```


5. Run the development server:
```bash
npm run dev
```


7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app router and API routes
- `/components`: React components
- `/public`: Static assets
- `/firebase.js`: Firebase configuration
- `/middleware.ts`: Clerk authentication middleware

## Key Components

- `StoreLesson.js`: Manages lesson storage in Firebase
- `fetchLesson.js`: Retrieves lessons from Firebase
- `QuizFirebase.js`: Handles quiz data operations
- `LearningStats.js`: Manages learning statistics


