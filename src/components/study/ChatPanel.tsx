// source_handbook: week11-hackathon-preparation
'use client';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const STARTER_QUESTIONS = [
  'Give me a quick overview of this material',
  'What are the key concepts covered?',
  'What should I focus on for an exam?',
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.success
          ? data.message
          : (data.message || data.error || 'Something went wrong.'),
        sources: data.sources,
        timestamp: new Date().toISOString(),
        guardrailBlocked: data.guardrailBlocked,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Network error. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (id: string) => {
    setExpandedSources(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef as any}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center text-3xl">
              🧠
            </div>
            <div>
              <p className="text-white font-semibold mb-1">RAG-Powered Chat</p>
              <p className="text-[#a1a1aa] text-sm max-w-xs">Ask anything about your uploaded material. All answers are grounded in your document.</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="glass glass-hover text-left text-sm text-[#a1a1aa] rounded-xl px-4 py-3 hover:text-white transition-colors border border-transparent hover:border-[#3b82f6]/30"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end chat-message-user' : 'justify-start chat-message-ai'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-[10px] font-bold text-white">SF</div>
                      <span className="text-[10px] text-[#a1a1aa]">StudyForge AI</span>
                      {msg.guardrailBlocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">Guardrail</span>
                      )}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#3b82f6] to-[#6366f1] text-white'
                        : msg.guardrailBlocked
                        ? 'glass border border-rose-500/30 text-rose-300'
                        : 'glass text-[#e4e4e7]'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="w-full">
                      <button
                        onClick={() => toggleSources(msg.id)}
                        className="text-[10px] text-[#3b82f6] hover:text-[#6366f1] flex items-center gap-1 px-1 transition-colors"
                      >
                        <span>{expandedSources.has(msg.id) ? '▼' : '▶'}</span>
                        {msg.sources.length} source{msg.sources.length !== 1 ? 's' : ''} used
                      </button>
                      {expandedSources.has(msg.id) && (
                        <div className="mt-1 space-y-1">
                          {msg.sources.map((s, i) => (
                            <div key={i} className="glass rounded-lg px-3 py-2 text-[11px] text-[#a1a1aa] border border-[#1e1e1e]">
                              <div className="flex justify-between mb-1">
                                <span className="font-mono text-[#3b82f6]">Chunk {s.chunkIndex + 1}</span>
                                <span className="text-emerald-400 font-mono">score: {s.score.toFixed(3)}</span>
                              </div>
                              <p className="line-clamp-2">{s.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start chat-message-ai">
                <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[#1e1e1e]">
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <input
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your material..."
            className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#4a4a4a] input-focus-gradient outline-none transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            id="chat-send-btn"
            className="btn-gradient text-white px-4 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
