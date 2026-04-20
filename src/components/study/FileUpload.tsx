// source_handbook: week11-hackathon-preparation
'use client';
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { DocumentStats } from '@/lib/types';

interface FileUploadProps {
  onUploadSuccess: (stats: DocumentStats, preview: string) => void;
  onUploading: (loading: boolean) => void;
}

export default function FileUpload({ onUploadSuccess, onUploading }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    const allowed = ['application/pdf', 'text/plain', 'text/markdown'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(file.type) && !['pdf', 'txt', 'md'].includes(ext || '')) {
      toast.error('Unsupported file. Please upload PDF, TXT, or MD.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.');
      return;
    }

    setUploading(true);
    onUploading(true);

    // Fake progress animation
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      setProgress(Math.min(prog, 85));
    }, 200);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      clearInterval(interval);
      setProgress(100);
      if (data.success) {
        toast.success(`✅ Processed ${data.stats.chunkCount} chunks from "${data.stats.fileName}"`);
        onUploadSuccess(data.stats, data.preview);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      clearInterval(interval);
      toast.error('Network error. Please try again.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        onUploading(false);
        setProgress(0);
      }, 600);
    }
  }, [onUploadSuccess, onUploading]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="p-4">
      <div
        className={`drop-zone rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        id="file-upload-zone"
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.md,text/plain,application/pdf,text/markdown"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center text-3xl">
          {uploading ? '⚡' : '📄'}
        </div>
        {uploading ? (
          <div className="w-full max-w-xs">
            <p className="text-sm text-[#a1a1aa] text-center mb-3 animate-pulse">
              Processing document...
            </p>
            <div className="w-full bg-[#1e1e1e] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full shimmer transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#3b82f6] text-center mt-2 font-mono">{Math.round(progress)}%</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Drop your study material here</p>
              <p className="text-[#a1a1aa] text-sm">or click to browse files</p>
            </div>
            <div className="flex gap-2">
              {['PDF', 'TXT', 'MD'].map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#1e1e1e] text-[#a1a1aa] border border-[#2a2a2a] font-mono">
                  .{t.toLowerCase()}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#a1a1aa]">Max 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}
