'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SoldierCard } from './SoldierCard';
import { Badge } from '@/components/ui/badge';
import type { Assignment, Role } from '@/db/types';
import { cn } from '@/lib/utils';

interface RoleLaneProps {
  slotId: string;
  role: Role;
  assignments: Assignment[];
  requiredCount: number;
  constraintsMap: Map<string, string>;
  assignmentCountMap: Map<string, number>;
  onRemoveAssignment: (assignmentId: string) => void;
}

export function RoleLane({
  slotId,
  role,
  assignments,
  requiredCount,
  constraintsMap,
  assignmentCountMap,
  onRemoveAssignment,
}: RoleLaneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: slotId });
  const filled = assignments.length;
  const isFull = filled >= requiredCount;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border p-2 min-h-[60px] transition-colors',
        isOver && 'bg-primary/5 border-primary/30 ring-1 ring-primary/20',
        isFull ? 'border-emerald-200 bg-emerald-50/30' : 'border-dashed'
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {role.name}
        </span>
        <Badge
          variant={isFull ? 'success' : filled > 0 ? 'warning' : 'outline'}
          className="text-[9px] px-1.5 py-0"
        >
          {filled}/{requiredCount}
        </Badge>
      </div>
      <SortableContext
        items={assignments.map(a => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {assignments.map(a => a.soldier && (
            <SoldierCard
              key={a.id}
              soldier={a.soldier}
              assignmentId={a.id}
              assignmentCount={assignmentCountMap.get(a.soldier_id) || 0}
              hasConstraints={constraintsMap.has(a.soldier_id)}
              constraintText={constraintsMap.get(a.soldier_id)}
              onRemove={() => onRemoveAssignment(a.id)}
              compact
            />
          ))}
        </div>
      </SortableContext>
      {assignments.length === 0 && (
        <div className="text-[10px] text-muted-foreground/50 text-center py-2">
          Drop here
        </div>
      )}
    </div>
  );
}
