'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SoldierCard } from './SoldierCard';
import { Badge } from '@/components/ui/badge';
import type { Soldier } from '@/db/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface UnassignedPanelProps {
  soldiers: Soldier[];
  constraintsMap: Map<string, string>;
  assignmentCountMap: Map<string, number>;
}

export function UnassignedPanel({
  soldiers,
  constraintsMap,
  assignmentCountMap,
}: UnassignedPanelProps) {
  const [search, setSearch] = useState('');
  const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });

  const filtered = soldiers.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.personal_number.includes(q)
    );
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-white rounded-xl border shadow-sm w-full lg:w-72 flex-shrink-0',
        isOver && 'ring-2 ring-primary/20'
      )}
    >
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">לא שובצו</h3>
          <Badge variant="outline">{soldiers.length}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full h-9 pl-8 pr-3 rounded-lg border text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="חפש חייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <SortableContext
        items={filtered.map(s => `soldier-${s.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
          {filtered.map(s => (
            <SoldierCard
              key={s.id}
              soldier={s}
              assignmentCount={assignmentCountMap.get(s.id) || 0}
              hasConstraints={constraintsMap.has(s.id)}
              constraintText={constraintsMap.get(s.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              {soldiers.length === 0 ? 'כל החיילים שובצו!' : 'לא נמצאו תוצאות'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
