// source_handbook: week11-hackathon-preparation
'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-mesh px-6 py-24">
      {/* Floating decorative cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[12%] left-[8%] glass rounded-xl p-4 w-52 animate-fade-in-up delay-200 rotate-[-6deg]">
          <p className="text-xs text-[#a1a1aa] mb-1">Flashcard</p>
          <p className="text-sm font-semibold text-white">What is RAG?</p>
          <div className="mt-2 h-px bg-gradient-to-r from-[#3b82f6]/30 to-transparent" />
          <p className="text-xs text-[#a1a1aa] mt-2">Retrieval-Augmented Generation...</p>
        </div>
        <div className="absolute top-[18%] right-[6%] glass rounded-xl p-4 w-56 animate-fade-in-up delay-300 rotate-[5deg]">
          <p className="text-xs text-[#a1a1aa] mb-1">Quiz · Q3</p>
          <p className="text-sm font-semibold text-white">Which model is used for embeddings?</p>
          <div className="mt-3 space-y-1">
            {['A. GPT-4', 'B. text-embedding-3-small', 'C. Davinci'].map((opt, i) => (
              <div key={i} className={`text-xs px-2 py-1 rounded ${i === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'text-[#a1a1aa]'}`}>{opt}</div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[5%] glass rounded-xl p-4 w-48 animate-fade-in-up delay-400 rotate-[4deg]">
          <p className="text-xs text-[#a1a1aa] mb-1">AI Logs</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#a1a1aa]">Tokens</span>
              <span className="text-[#3b82f6] font-mono">1,247</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#a1a1aa]">Latency</span>
              <span className="text-emerald-400 font-mono">843ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#a1a1aa]">Quality</span>
              <span className="text-amber-400 font-mono">4/5 ⭐</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[28%] right-[8%] glass rounded-xl p-4 w-52 animate-fade-in-up delay-500 rotate-[-4deg]">
          <p className="text-xs text-[#a1a1aa] mb-2">Summary generated ✓</p>
          <div className="h-1.5 rounded-full bg-[#1e1e1e] mb-1"><div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]" /></div>
          <p className="text-xs text-[#a1a1aa]">3 key concepts identified</p>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-[#a1a1aa] font-medium tracking-wide uppercase">Powered by OpenAI GPT-4o-mini</span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6 animate-fade-in-up delay-100"
          style={{ letterSpacing: '-0.02em' }}
        >
          Turn Any Study Material Into an{' '}
          <span className="gradient-text text-glow-blue">AI-Powered</span>{' '}
          Learning Experience
        </h1>

        <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Upload your notes, PDFs, or textbooks. Get instant summaries, flashcards, quizzes,
          and an AI tutor that only answers from{' '}
          <span className="text-white font-semibold">YOUR material</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <Link
            href="/study"
            id="hero-cta-start"
            className="btn-gradient text-white font-semibold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 shadow-lg"
          >
            Start Studying
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <a
            href="#how-it-works"
            className="glass glass-hover text-white font-semibold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
          >
            How it works
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fade-in-up delay-400">
          {[
            { label: 'AI Concepts', value: '6' },
            { label: 'GenAI Guardrails', value: '3 Layers' },
            { label: 'RAG Pipeline', value: 'In-Memory' },
            { label: 'Models', value: 'GPT-4o-mini' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-[#a1a1aa] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
