// source_handbook: week11-hackathon-preparation
import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/logger';

export async function GET() {
  const logs = getLogs();
  const totalCalls = logs.length;
  const totalTokens = logs.reduce((sum, l) => sum + l.totalTokens, 0);
  const avgLatency = totalCalls > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.latencyMs, 0) / totalCalls)
    : 0;
  const blockedCount = logs.filter(l => !l.guardrailsPassed).length;
  const blockRate = totalCalls > 0 ? Math.round((blockedCount / totalCalls) * 100) : 0;

  return NextResponse.json({
    logs,
    stats: {
      totalCalls,
      totalTokens,
      avgLatencyMs: avgLatency,
      guardrailBlockRate: blockRate,
    },
  });
}
