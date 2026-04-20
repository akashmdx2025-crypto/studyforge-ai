// source_handbook: week11-hackathon-preparation
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] bg-[#0a0a0a] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-sm font-bold text-white">
              SF
            </div>
            <span className="font-semibold text-white">StudyForge AI</span>
          </div>
          <p className="text-sm text-[#a1a1aa] text-center">
            Built for{' '}
            <span className="text-[#3b82f6] font-medium">CST4625 Generative AI Module</span>{' '}
            | Powered by{' '}
            <span className="text-white font-medium">OpenAI</span>
          </p>
          <Link href="/study" className="text-sm text-[#3b82f6] hover:underline">
            Open Study Workspace →
          </Link>
        </div>
      </footer>
    </main>
  );
}
