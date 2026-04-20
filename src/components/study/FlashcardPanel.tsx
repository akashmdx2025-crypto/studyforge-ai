// source_handbook: week11-hackathon-preparation
'use client';
import { useState } from 'react';
import { Flashcard } from '@/lib/types';
import { toast } from 'sonner';

const COUNT_OPTIONS = [10, 20, 30];

export default function FlashcardPanel() {
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [studyMore, setStudyMore] = useState<Set<number>>(new Set());

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (data.success) {
        setCards(data.flashcards.flashcards);
        setCurrent(0);
        setFlipped(false);
        setKnown(new Set());
        setStudyMore(new Set());
        toast.success(`Generated ${data.flashcards.flashcards.length} flashcards!`);
      } else {
        toast.error(data.error || 'Failed to generate flashcards');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const next = () => { setCurrent(i => Math.min(i + 1, cards.length - 1)); setFlipped(false); };
  const prev = () => { setCurrent(i => Math.max(i - 1, 0)); setFlipped(false); };

  const markKnown = () => { setKnown(s => new Set([...s, cards[current].id])); next(); };
  const markStudy = () => { setStudyMore(s => new Set([...s, cards[current].id])); next(); };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🃏</div>
          <h3 className="text-xl font-bold text-white mb-2">Flashcard Generator</h3>
          <p className="text-[#a1a1aa] text-sm max-w-xs">Create swipeable flashcards from key concepts in your material.</p>
        </div>
        <div className="flex gap-2">
          {COUNT_OPTIONS.map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${count === n ? 'btn-gradient text-white' : 'glass text-[#a1a1aa] hover:text-white border border-transparent hover:border-[#3b82f6]/30'}`}>
              {n} cards
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={loading} id="generate-flashcards-btn"
          className="btn-gradient text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>) : 'Generate Flashcards ⚡'}
        </button>
      </div>
    );
  }

  const card = cards[current];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-[#a1a1aa] mb-2">
          <span>Card {current + 1} of {cards.length}</span>
          <span className="flex gap-3">
            <span className="text-emerald-400">✓ {known.size}</span>
            <span className="text-rose-400">↩ {studyMore.size}</span>
          </span>
        </div>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i === current ? 'bg-[#3b82f6]' : known.has(cards[i].id) ? 'bg-emerald-500' : studyMore.has(cards[i].id) ? 'bg-rose-500' : 'bg-[#1e1e1e]'}`} />
          ))}
        </div>
      </div>

      {/* 3D flip card */}
      <div className="flex-1 flashcard-container cursor-pointer" onClick={() => setFlipped(f => !f)}>
        <div className={`flashcard-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-front glass flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-xs text-[#a1a1aa] uppercase tracking-widest font-semibold">Question</span>
            <p className="text-xl font-bold text-white leading-relaxed">{card.front}</p>
            <span className="text-xs text-[#a1a1aa] mt-4">Click to reveal answer</span>
          </div>
          {/* Back */}
          <div className="flashcard-back bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 border border-[#3b82f6]/20 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold">Answer</span>
            <p className="text-lg text-white leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      {flipped && (
        <div className="flex gap-2 animate-fade-in">
          <button onClick={markStudy} className="flex-1 glass glass-hover border border-rose-500/30 hover:border-rose-500/60 text-rose-400 font-semibold py-3 rounded-xl text-sm transition-all">
            ↩ Study More
          </button>
          <button onClick={markKnown} className="flex-1 glass glass-hover border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 font-semibold py-3 rounded-xl text-sm transition-all">
            ✓ Know It
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={prev} disabled={current === 0} className="glass glass-hover text-white px-4 py-2.5 rounded-xl disabled:opacity-30 text-sm">← Prev</button>
        <button onClick={() => setFlipped(f => !f)} className="flex-1 glass glass-hover text-white font-semibold py-2.5 rounded-xl text-sm">
          {flipped ? 'Show Question' : 'Reveal Answer'}
        </button>
        <button onClick={next} disabled={current === cards.length - 1} className="glass glass-hover text-white px-4 py-2.5 rounded-xl disabled:opacity-30 text-sm">Next →</button>
      </div>
    </div>
  );
}
