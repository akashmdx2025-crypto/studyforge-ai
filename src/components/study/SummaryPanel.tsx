// source_handbook: week11-hackathon-preparation
'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const LEVELS = ['brief', 'standard', 'detailed'] as const;
type DetailLevel = typeof LEVELS[number];

export default function SummaryPanel() {
  const [level, setLevel] = useState<DetailLevel>('standard');
  const [summary, setSummary] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setSummary('');
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detailLevel: level }),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setWordCount(data.wordCount);
        toast.success('Summary generated!');
      } else {
        toast.error(data.error || 'Failed to generate summary');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast.success('Copied to clipboard!');
  };

  if (!summary && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Summary Generator</h3>
          <p className="text-[#a1a1aa] text-sm max-w-xs">Generate a structured summary of your entire document with key topics and definitions.</p>
        </div>
        <div className="flex gap-2">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${level === l ? 'btn-gradient text-white' : 'glass text-[#a1a1aa] hover:text-white border border-transparent hover:border-[#3b82f6]/30'}`}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={generate} disabled={loading} id="generate-summary-btn"
          className="btn-gradient text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2">
          Generate Summary ⚡
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Header controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${level === l ? 'btn-gradient text-white' : 'glass text-[#a1a1aa] hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {wordCount > 0 && <span className="text-xs text-[#a1a1aa] font-mono">{wordCount} words</span>}
          {summary && (
            <button onClick={copyToClipboard} className="glass glass-hover text-xs text-[#a1a1aa] hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-[#3b82f6]/30 transition-all">
              📋 Copy
            </button>
          )}
          <button onClick={generate} disabled={loading}
            className="btn-gradient text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1">
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '⚡'} Regenerate
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 glass rounded-2xl p-5">
        {loading ? (
          <div className="space-y-3">
            {[80, 60, 90, 50, 70].map((w, i) => (
              <div key={i} className="h-4 rounded-full bg-[#1e1e1e] shimmer" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
              h1: ({ children }) => <h1 className="text-2xl font-bold gradient-text mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold text-[#a1a1aa] mt-4 mb-2">{children}</h3>,
              li: ({ children }) => <li className="text-[#d4d4d8] my-1">{children}</li>,
              p: ({ children }) => <p className="text-[#d4d4d8] leading-relaxed mb-3">{children}</p>,
            }}
          >
            {summary}
          </ReactMarkdown>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
