// source_handbook: week11-hackathon-preparation
'use client';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: '📂',
    title: 'Upload',
    desc: 'Drag and drop your PDF, TXT, or Markdown study material. Up to 10MB supported.',
    detail: 'pdf-parse extracts text • chunked into ~500-token segments',
  },
  {
    number: '02',
    icon: '⚡',
    title: 'Process',
    desc: 'AI chunks, embeds, and indexes your content using OpenAI embeddings in seconds.',
    detail: 'text-embedding-3-small • in-memory vector store • cosine similarity',
  },
  {
    number: '03',
    icon: '🎓',
    title: 'Study',
    desc: 'Chat with your material, generate quizzes, flashcards, and AI summaries instantly.',
    detail: 'gemini-1.5-flash • guardrails • logging • full transparency',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg">From upload to understanding in three simple steps.</p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row gap-8 items-stretch">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/2 left-[calc(33%-24px)] right-[calc(33%-24px)] h-px bg-gradient-to-r from-[#3b82f6]/50 via-[#8b5cf6]/50 to-[#3b82f6]/50 -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <div key={step.number} className="flex-1 relative z-10 animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
              <div className="glass rounded-2xl p-8 h-full text-center flex flex-col items-center hover:border-[#3b82f6]/30 border border-transparent transition-all duration-300">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold font-mono text-[#3b82f6] bg-[#141414] border border-[#2a2a2a] rounded-full w-7 h-7 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed mb-4">{step.desc}</p>
                <p className="text-xs text-[#3b82f6]/70 font-mono bg-[#141414] rounded-lg px-3 py-2 border border-[#1e1e1e]">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-fade-in-up delay-500">
          <Link
            href="/study"
            id="howitworks-cta"
            className="btn-gradient text-white font-semibold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-2"
          >
            Get Started Free
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
