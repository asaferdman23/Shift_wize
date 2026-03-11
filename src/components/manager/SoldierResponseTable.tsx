'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { AvailabilitySubmission, WeekParticipant } from '@/db/types';
import { SHIFT_ORDER, PARTICIPANT_LABELS } from '@/db/types';
import { formatDate, getShiftEmoji } from '@/lib/utils';
import { Filter } from 'lucide-react';

type FilterType = 'all' | 'not_submitted' | 'reinforcement' | 'constraints';

interface SoldierResponseTableProps {
  submissions: AvailabilitySubmission[];
  participants: WeekParticipant[];
  dates: string[];
}

export function SoldierResponseTable({ submissions, participants, dates }: SoldierResponseTableProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const subMap = new Map(submissions.map(s => [s.soldier_id, s]));

  const rows = participants.map(p => {
    const sub = subMap.get(p.soldier_id);
    return {
      participant: p,
      soldier: p.soldier!,
      submission: sub,
      hasSubmitted: !!sub,
      hasConstraints: !!(sub?.constraints_text && sub.constraints_text.length > 0),
      isReinforcement: p.soldier?.participant_type === 'reinforcement',
    };
  }).filter(r => r.soldier);

  const filtered = rows.filter(r => {
    if (filter === 'not_submitted') return !r.hasSubmitted;
    if (filter === 'reinforcement') return r.isReinforcement;
    if (filter === 'constraints') return r.hasConstraints;
    return true;
  });

  filtered.sort((a, b) => {
    if (a.hasSubmitted !== b.hasSubmitted) return a.hasSubmitted ? -1 : 1;
    return `${a.soldier.last_name}`.localeCompare(`${b.soldier.last_name}`);
  });

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'הכל', count: rows.length },
    { key: 'not_submitted', label: 'לא הגישו', count: rows.filter(r => !r.hasSubmitted).length },
    { key: 'reinforcement', label: 'תגבור', count: rows.filter(r => r.isReinforcement).length },
    { key: 'constraints', label: 'עם הגבלות', count: rows.filter(r => r.hasConstraints).length },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b overflow-x-auto">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {f.label}
            <span className={`text-[10px] ${filter === f.key ? 'text-primary-foreground/80' : 'text-muted-foreground/60'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">אין תוצאות</p>
          <p className="text-sm mt-1">
            {filter !== 'all' ? 'נסה לשנות את הפילטר.' : 'שתף את הלינק עם הצוות כדי להתחיל לאסוף זמינות.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-right p-3 font-medium text-muted-foreground sticky right-0 bg-white z-10">
                  חייל
                </th>
                <th className="text-center p-2 font-medium text-muted-foreground text-xs">סוג</th>
                <th className="text-center p-2 font-medium text-muted-foreground text-xs">סטטוס</th>
                {dates.map(d => (
                  SHIFT_ORDER.map(s => (
                    <th key={`${d}-${s}`} className="text-center p-2 font-medium text-muted-foreground whitespace-nowrap text-xs">
                      <div>{formatDate(d).split(' ').slice(1).join(' ')}</div>
                      <div>{getShiftEmoji(s)}</div>
                    </th>
                  ))
                ))}
                <th className="text-right p-3 font-medium text-muted-foreground">הגבלות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const name = `${row.soldier.first_name} ${row.soldier.last_name}`;
                return (
                  <tr
                    key={row.soldier.id}
                    className={`border-b hover:bg-muted/20 transition-colors ${!row.hasSubmitted ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="p-3 font-medium whitespace-nowrap sticky right-0 bg-white z-10">
                      <div>{name}</div>
                      <div className="text-xs text-muted-foreground">{row.soldier.personal_number}</div>
                    </td>
                    <td className="text-center p-2">
                      <Badge
                        variant={row.isReinforcement ? 'warning' : 'default'}
                        className="text-[10px]"
                      >
                        {PARTICIPANT_LABELS[row.soldier.participant_type]}
                      </Badge>
                    </td>
                    <td className="text-center p-2">
                      {row.hasSubmitted ? (
                        <Badge variant="success" className="text-[10px]">
                          {row.participant.response_status === 'updated' ? 'עודכן' : 'הוגש'}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">
                          חסר
                        </Badge>
                      )}
                    </td>
                    {dates.map(d =>
                      SHIFT_ORDER.map(s => {
                        if (!row.submission) {
                          return (
                            <td key={`${d}-${s}`} className="text-center p-2">
                              <span className="inline-block w-6 h-6 rounded-full text-xs leading-6 bg-gray-50 text-gray-300">
                                —
                              </span>
                            </td>
                          );
                        }
                        const entry = row.submission.entries?.find(e => e.date === d && e.shift_type === s);
                        const isAvail = entry?.preference === 'available';
                        return (
                          <td key={`${d}-${s}`} className="text-center p-2">
                            <span className={`inline-block w-6 h-6 rounded-full text-xs leading-6 ${
                              isAvail
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {isAvail ? '✓' : '—'}
                            </span>
                          </td>
                        );
                      })
                    )}
                    <td className="p-3 max-w-[200px]">
                      {row.hasConstraints ? (
                        <Badge variant="warning" className="text-[10px] truncate max-w-full">
                          {row.submission?.constraints_text}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
