// source_handbook: week11-hackathon-preparation
'use client';
import { useState, useEffect, useCallback } from 'react';
import { AILogEntry } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

function QualityStars({ score }: { score?: number }) {
  if (!score) return <span className="text-[#555]">—</span>;
  return (
    <span className="text-amber-400 font-mono text-xs">
      {'★'.repeat(score)}{'☆'.repeat(5 - score)}
    </span>
  );
}

export default function AILogPanel() {
  const [logs, setLogs] = useState<AILogEntry[]>([]);
  const [stats, setStats] = useState({ totalCalls: 0, totalTokens: 0, avgLatencyMs: 0, guardrailBlockRate: 0 });
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data.logs || []);
      setStats(data.stats || {});
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionColors: Record<string, string> = {
    chat: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    quiz: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    flashcards: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    summary: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Calls', value: stats.totalCalls, color: 'text-[#3b82f6]' },
          { label: 'Total Tokens', value: stats.totalTokens.toLocaleString(), color: 'text-violet-400' },
          { label: 'Avg Latency', value: `${stats.avgLatencyMs}ms`, color: 'text-amber-400' },
          { label: 'Blocked %', value: `${stats.guardrailBlockRate}%`, color: stats.guardrailBlockRate > 0 ? 'text-rose-400' : 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">AI Interaction Log</p>
        <button onClick={fetchLogs} disabled={loading}
          className="glass glass-hover text-xs text-[#a1a1aa] hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-[#3b82f6]/30 flex items-center gap-1.5 transition-all">
          {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🔄'}
          Refresh
        </button>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1 glass rounded-2xl">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-6">
            <p className="text-[#a1a1aa] text-sm">No AI calls yet. Use Chat, Quiz, Flashcards, or Summary to generate logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#a1a1aa] border-b border-[#1e1e1e]">
                  {['Time', 'Action', 'Model', 'Tokens', 'Latency', 'Guardrails', 'Quality'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-[#0f0f0f] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-[#a1a1aa] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase ${actionColors[log.action] || 'text-[#a1a1aa]'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#a1a1aa] whitespace-nowrap">{log.model}</td>
                    <td className="px-4 py-3 font-mono text-white">{log.totalTokens.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-amber-400">{log.latencyMs}ms</td>
                    <td className="px-4 py-3">
                      {log.guardrailsPassed ? (
                        <span className="text-emerald-400 font-semibold">✓ Pass</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">✗ Block</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <QualityStars score={log.qualityScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
