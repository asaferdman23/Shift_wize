'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { ParticipantSummary } from '@/db/types';

interface ResponseSummaryCardsProps {
  summary: ParticipantSummary;
}

export function ResponseSummaryCards({ summary }: ResponseSummaryCardsProps) {
  const pct = summary.total_expected > 0
    ? Math.round((summary.submitted / summary.total_expected) * 100)
    : 0;

  const cards = [
    {
      label: 'סה"כ צפויים',
      value: summary.total_expected,
      sub: `${summary.total_core} ליבה · ${summary.total_reinforcement} תגבור`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'הגיבו',
      value: `${summary.submitted} (${pct}%)`,
      sub: summary.updated > 0 ? `${summary.updated} עדכנו` : undefined,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'לא הגיבו',
      value: summary.not_started,
      sub: summary.not_started > 0 ? 'שלח תזכורת' : 'הכל בסדר!',
      icon: Clock,
      color: summary.not_started > 0 ? 'text-red-600' : 'text-emerald-600',
      bg: summary.not_started > 0 ? 'bg-red-50' : 'bg-emerald-50',
    },
    {
      label: 'עם הגבלות',
      value: summary.with_constraints,
      sub: undefined,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold mt-1">{c.value}</p>
                {c.sub && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${c.bg}`}>
                <c.icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
