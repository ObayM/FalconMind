import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'
import Header from "../components/header";
import { Analytics } from "@vercel/analytics/react"
import { ClerkProvider} from '@clerk/nextjs'
import { UserProgressProvider } from "@/components/UserProgress";
import { LearningStatsProvider } from '@/components/LearningStats';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FalconMind - Learning Platform",
  description: "FalconMind a learning platform that makes learning easy",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <Providers>
        <LearningStatsProvider>
        <UserProgressProvider>

          <Header />
        {children}
        
        </UserProgressProvider>
        </LearningStatsProvider>

        </Providers>
        </body>
    </html>
    </ClerkProvider>
  );
}
