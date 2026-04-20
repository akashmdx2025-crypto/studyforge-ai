// source_handbook: week11-hackathon-preparation
'use client';
import { DocumentStats } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentViewerProps {
  stats: DocumentStats;
  preview: string;
}

export default function DocumentViewer({ stats, preview }: DocumentViewerProps) {
  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Words', value: stats.wordCount.toLocaleString() },
          { label: 'Chars', value: stats.charCount.toLocaleString() },
          { label: 'Chunks', value: stats.chunkCount.toString() },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold font-mono gradient-text">{s.value}</p>
            <p className="text-xs text-[#a1a1aa]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* File info */}
      <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
        <span className="text-xl">{stats.fileType === 'pdf' ? '📕' : '📄'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{stats.fileName}</p>
          <p className="text-xs text-[#a1a1aa] uppercase font-mono">{stats.fileType} • {stats.chunkCount} chunks indexed</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Indexed" />
      </div>

      {/* Text preview */}
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2 px-1">Document Preview</p>
        <ScrollArea className="flex-1 glass rounded-xl p-4">
          <pre className="text-sm text-[#a1a1aa] whitespace-pre-wrap leading-relaxed font-mono break-words">
            {preview}
            {preview.length >= 500 && (
              <span className="text-[#3b82f6]">... (truncated preview — full content indexed)</span>
            )}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
