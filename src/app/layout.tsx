// source_handbook: week11-hackathon-preparation
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StudyForge AI — AI-Powered Study Companion',
  description:
    'Transform your study materials into interactive learning experiences. Get AI-powered summaries, flashcards, quizzes, and a RAG-powered tutor grounded in your own documents.',
  keywords: ['AI study', 'flashcards', 'quiz generator', 'RAG', 'study assistant', 'OpenAI'],
  openGraph: {
    title: 'StudyForge AI',
    description: 'Upload your notes. Get instant summaries, flashcards, and quizzes.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0a0a0a] text-[#fafafa] antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  );
}
