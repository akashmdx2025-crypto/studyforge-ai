// source_handbook: week11-hackathon-preparation
'use client';

const features = [
  {
    icon: '📄',
    title: 'Smart Upload',
    desc: 'Drop any PDF or text. We chunk it, embed it, and make it searchable in seconds.',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'hover:border-blue-500/50',
    badge: 'Multimodal Input',
  },
  {
    icon: '🧠',
    title: 'RAG-Powered Chat',
    desc: "Ask questions and get answers grounded ONLY in your uploaded material. No hallucinations.",
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'hover:border-violet-500/50',
    badge: 'RAG',
  },
  {
    icon: '📝',
    title: 'Auto-Generated Quizzes',
    desc: 'Test yourself with AI-generated MCQs and short-answer questions from your content.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'hover:border-emerald-500/50',
    badge: 'Constrained Prompting',
  },
  {
    icon: '🃏',
    title: 'Flashcard Generator',
    desc: 'Key concepts turned into swipeable flashcards for rapid revision.',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'hover:border-amber-500/50',
    badge: 'Constrained Prompting',
  },
  {
    icon: '📊',
    title: 'AI Transparency',
    desc: 'See every AI call logged — tokens used, response time, quality scores. Full observability.',
    color: 'from-rose-500/20 to-rose-600/10',
    border: 'hover:border-rose-500/50',
    badge: 'Evaluation / Logging',
  },
  {
    icon: '🛡️',
    title: 'Guardrailed AI',
    desc: 'The AI refuses to answer anything outside your material. Grounded, not hallucinated.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'hover:border-cyan-500/50',
    badge: 'Guardrails',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">study smarter</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
            Six AI/GenAI concepts working together to supercharge your revision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass glass-hover rounded-2xl p-6 border border-transparent transition-all duration-300 ${f.border} animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
              </div>
              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-4">{f.desc}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#1e1e1e] text-[#a1a1aa] border border-[#2a2a2a]">
                {f.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
