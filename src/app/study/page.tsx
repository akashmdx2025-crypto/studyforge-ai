// source_handbook: week11-hackathon-preparation
'use client';
import { useState } from 'react';
import { DocumentStats, VectorEntry } from '@/lib/types';
import FileUpload from '@/components/study/FileUpload';
import DocumentViewer from '@/components/study/DocumentViewer';
import ChatPanel from '@/components/study/ChatPanel';
import QuizPanel from '@/components/study/QuizPanel';
import FlashcardPanel from '@/components/study/FlashcardPanel';
import SummaryPanel from '@/components/study/SummaryPanel';
import AILogPanel from '@/components/study/AILogPanel';
import Link from 'next/link';

type Tab = 'chat' | 'quiz' | 'flashcards' | 'summary' | 'logs';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '🧠' },
  { id: 'quiz', label: 'Quiz', icon: '📝' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏' },
  { id: 'summary', label: 'Summary', icon: '📊' },
  { id: 'logs', label: 'AI Logs', icon: '📋' },
];

export default function StudyPage() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [preview, setPreview] = useState('');
  const [context, setContext] = useState<VectorEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const handleUploadSuccess = (s: DocumentStats, p: string, entries: VectorEntry[]) => {
    setStats(s);
    setPreview(p);
    setContext(entries);
    setActiveTab('chat');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Top nav */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">SF</div>
          <span className="font-semibold text-white text-sm">StudyForge AI</span>
        </Link>
        {stats && (
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-[#a1a1aa] truncate max-w-[200px]">{stats.fileName}</span>
            <span className="text-xs text-[#3b82f6] font-mono">{stats.chunkCount} chunks</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#a1a1aa] hidden sm:block">gemini-1.5-flash-latest · RAG</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[38%] min-w-[280px] border-r border-[#1e1e1e] flex flex-col overflow-hidden bg-[#0d0d0d]">
          <div className="px-4 pt-3 pb-2 border-b border-[#1e1e1e] flex-shrink-0">
            <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              {stats ? '📄 Document' : '📂 Upload Material'}
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            {stats ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <DocumentViewer stats={stats} preview={preview} />
                </div>
                <div className="border-t border-[#1e1e1e] p-3">
                  <button
                    onClick={() => { setStats(null); setPreview(''); setContext([]); }}
                    className="w-full glass glass-hover text-xs text-[#a1a1aa] hover:text-rose-400 py-2 rounded-lg border border-transparent hover:border-rose-500/30 transition-all"
                  >
                    🗑 Remove document & upload new
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <FileUpload onUploadSuccess={handleUploadSuccess} onUploading={setUploading} />
                {uploading && (
                  <div className="px-4 pb-4 text-center">
                    <p className="text-xs text-[#a1a1aa] animate-pulse">Processing chunks with Gemini...</p>
                  </div>
                )}
                {!uploading && (
                  <div className="px-4 pb-4">
                    <div className="glass rounded-xl p-4 text-center">
                      <p className="text-xs text-[#a1a1aa] mb-2">Supported GenAI Concepts</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {['RAG', 'Guardrails', 'Constrained Prompting', 'Evaluation', 'Multimodal'].map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e1e1e] text-[#a1a1aa] border border-[#2a2a2a]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[#1e1e1e] flex-shrink-0 px-1 bg-[#0d0d0d]">
            {TABS.map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white tab-active'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {!stats && activeTab !== 'logs' ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 flex items-center justify-center text-4xl">
                  {TABS.find(t => t.id === activeTab)?.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">Upload a document first</p>
                  <p className="text-[#a1a1aa] text-sm">Add your study material on the left to unlock {activeTab}.</p>
                </div>
              </div>
            ) : (
              <div className="h-full animate-fade-in">
                {activeTab === 'chat' && <ChatPanel context={context} />}
                {activeTab === 'quiz' && <QuizPanel context={context} />}
                {activeTab === 'flashcards' && <FlashcardPanel context={context} />}
                {activeTab === 'summary' && <SummaryPanel context={context} />}
                {activeTab === 'logs' && <AILogPanel />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
