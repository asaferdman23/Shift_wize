'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponseSummaryCards } from '@/components/manager/ResponseSummaryCards';
import { SoldierResponseTable } from '@/components/manager/SoldierResponseTable';
import { MissingRespondersPanel } from '@/components/manager/MissingRespondersPanel';
import { RecommendationBoard } from '@/components/board/RecommendationBoard';
import type { Week, WeekSlot, Role, AvailabilitySubmission, WeekParticipant, ParticipantSummary, MissingResponder } from '@/db/types';
import { STATUS_LABELS } from '@/db/types';
import { Copy, ExternalLink, Check, LayoutGrid, Table, RefreshCw, UserX } from 'lucide-react';

interface ManagerDashboardClientProps {
  week: Week;
  slots: WeekSlot[];
  roles: Role[];
  initialSubmissions: AvailabilitySubmission[];
  initialParticipants: WeekParticipant[];
  initialSummary: ParticipantSummary;
  initialMissing: MissingResponder[];
}

export function ManagerDashboardClient({
  week,
  slots,
  roles,
  initialSubmissions,
  initialParticipants,
  initialSummary,
  initialMissing,
}: ManagerDashboardClientProps) {
  const [tab, setTab] = useState<'responses' | 'missing' | 'board'>('responses');
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [participants, setParticipants] = useState(initialParticipants);
  const [summary, setSummary] = useState(initialSummary);
  const [missing, setMissing] = useState(initialMissing);
  const [copied, setCopied] = useState(false);

  const dates = [week.thursday_date, week.friday_date, week.saturday_date];
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/week/${week.id}`
    : `/week/${week.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refresh = useCallback(async () => {
    const [subsRes, partsRes, summaryRes, missingRes] = await Promise.all([
      fetch(`/api/weeks/${week.id}/submissions`),
      fetch(`/api/weeks/${week.id}/participants`),
      fetch(`/api/weeks/${week.id}/participants?view=summary`),
      fetch(`/api/weeks/${week.id}/participants?view=missing`),
    ]);
    setSubmissions(await subsRes.json());
    setParticipants(await partsRes.json());
    setSummary(await summaryRes.json());
    setMissing(await missingRes.json());
  }, [week.id]);

  const tabs = [
    { key: 'responses' as const, label: 'Responses', icon: Table, count: summary.submitted },
    { key: 'missing' as const, label: 'Missing', icon: UserX, count: summary.not_started },
    { key: 'board' as const, label: 'Schedule Board', icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold">{week.title}</h1>
                  <Badge variant={week.status === 'open' ? 'success' : 'secondary'}>
                    {STATUS_LABELS[week.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={refresh}>
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <a href={`/week/${week.id}/schedule`} target="_blank">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Schedule
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Summary */}
        <ResponseSummaryCards summary={summary} />

        {/* Share link bar */}
        <Card className="border-0 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium">Share link:</span>
              <code className="text-xs bg-white px-3 py-1.5 rounded-lg border flex-1 min-w-0 truncate">
                {shareUrl}
              </code>
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {t.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  tab === t.key
                    ? t.key === 'missing' && t.count > 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-muted text-muted-foreground'
                    : t.key === 'missing' && t.count > 0
                      ? 'bg-red-100 text-red-600'
                      : 'bg-muted/80 text-muted-foreground/60'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'responses' && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">All Participants</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <SoldierResponseTable
                submissions={submissions}
                participants={participants}
                dates={dates}
              />
            </CardContent>
          </Card>
        )}

        {tab === 'missing' && (
          <MissingRespondersPanel
            missing={missing}
            shareUrl={shareUrl}
          />
        )}

        {tab === 'board' && (
          <RecommendationBoard
            week={week}
            slots={slots}
            roles={roles}
            submissions={submissions}
          />
        )}
      </div>
    </div>
  );
}
