// source_handbook: week11-hackathon-preparation
'use client';
import { useState } from 'react';
import { QuizQuestion } from '@/lib/types';
import { toast } from 'sonner';

const COUNT_OPTIONS = [5, 10, 15];

export default function QuizPanel() {
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentIdx(0);
    setSelected({});
    setShowResult(false);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.quiz.questions);
        toast.success(`Generated ${data.quiz.questions.length} questions!`);
      } else {
        toast.error(data.error || 'Failed to generate quiz');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId: number, option: string) => {
    if (selected[questionId]) return;
    setSelected(prev => ({ ...prev, [questionId]: option }));
  };

  const score = questions.filter(q => selected[q.id] === q.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const getGrade = () => {
    if (pct >= 90) return { grade: 'A+', color: 'text-emerald-400', emoji: '🏆' };
    if (pct >= 80) return { grade: 'A', color: 'text-emerald-400', emoji: '⭐' };
    if (pct >= 70) return { grade: 'B', color: 'text-blue-400', emoji: '👍' };
    if (pct >= 60) return { grade: 'C', color: 'text-amber-400', emoji: '📚' };
    return { grade: 'F', color: 'text-rose-400', emoji: '💪' };
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">Quiz Generator</h3>
          <p className="text-[#a1a1aa] text-sm max-w-xs">Generate AI-powered multiple choice questions from your uploaded material.</p>
        </div>
        <div className="flex gap-2">
          {COUNT_OPTIONS.map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${count === n ? 'btn-gradient text-white' : 'glass text-[#a1a1aa] hover:text-white border border-transparent hover:border-[#3b82f6]/30'}`}>
              {n} Qs
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={loading} id="generate-quiz-btn"
          className="btn-gradient text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>) : 'Generate Quiz ⚡'}
        </button>
      </div>
    );
  }

  if (showResult) {
    const g = getGrade();
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6 text-center">
        <div className="score-reveal">
          <div className="text-6xl mb-2">{g.emoji}</div>
          <div className={`text-7xl font-black ${g.color} mb-2`}>{pct}%</div>
          <div className={`text-3xl font-bold ${g.color}`}>{g.grade}</div>
        </div>
        <div className="glass rounded-2xl p-6 w-full max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#a1a1aa]">Correct</span>
            <span className="text-emerald-400 font-bold">{score}/{questions.length}</span>
          </div>
          <div className="w-full bg-[#1e1e1e] rounded-full h-3">
            <div className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] transition-all duration-1000"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setCurrentIdx(0); setSelected({}); setShowResult(false); }}
            className="glass glass-hover text-white font-semibold px-6 py-3 rounded-xl border border-transparent hover:border-[#3b82f6]/30">
            Review Answers
          </button>
          <button onClick={generate} className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl">
            New Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const userAnswer = selected[q.id];
  const answered = !!userAnswer;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div>
        <div className="flex justify-between text-xs text-[#a1a1aa] mb-2">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Object.keys(selected).length} answered</span>
        </div>
        <div className="w-full bg-[#1e1e1e] rounded-full h-1.5">
          <div className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 flex-1 flex flex-col gap-4 animate-scale-in">
        <p className="text-white font-semibold text-base leading-relaxed">{q.question}</p>
        <div className="grid grid-cols-1 gap-2">
          {(Object.entries(q.options) as [string, string][]).map(([key, val]) => {
            let cls = 'glass glass-hover border border-transparent text-[#a1a1aa] hover:text-white';
            if (answered) {
              if (key === q.correct) cls = 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300';
              else if (key === userAnswer) cls = 'bg-rose-500/20 border border-rose-500/50 text-rose-300';
              else cls = 'glass border border-transparent text-[#555] cursor-default';
            }
            return (
              <button key={key} onClick={() => handleSelect(q.id, key)} disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${cls}`}>
                <span className="font-mono font-bold mr-2 text-[#3b82f6]">{key}.</span>{val}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`rounded-xl px-4 py-3 text-sm animate-fade-in ${userAnswer === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
            <span className="font-bold mr-1">{userAnswer === q.correct ? '✅ Correct!' : `❌ Incorrect. Answer: ${q.correct}`}</span>
            <span className="text-[#a1a1aa] text-xs">{q.explanation}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}
          className="glass glass-hover text-white px-4 py-2.5 rounded-xl disabled:opacity-30 text-sm">← Prev</button>
        {currentIdx < questions.length - 1 ? (
          <button onClick={() => setCurrentIdx(i => i + 1)}
            className="flex-1 btn-gradient text-white font-semibold py-2.5 rounded-xl text-sm">Next →</button>
        ) : (
          <button onClick={() => setShowResult(true)}
            className="flex-1 btn-gradient text-white font-semibold py-2.5 rounded-xl text-sm">See Results 🏆</button>
        )}
      </div>
    </div>
  );
}
