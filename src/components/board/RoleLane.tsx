'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SoldierCard } from './SoldierCard';
import { Badge } from '@/components/ui/badge';
import type { Assignment, Role, ConflictReport } from '@/db/types';
import { cn } from '@/lib/utils';
import { getSlotConflicts, getAssignmentConflicts } from '@/lib/conflict-detector';

interface RoleLaneProps {
  slotId: string;
  role: Role;
  assignments: Assignment[];
  requiredCount: number;
  constraintsMap: Map<string, string>;
  assignmentCountMap: Map<string, number>;
  onRemoveAssignment: (assignmentId: string) => void;
  conflictReport: ConflictReport;
}

export function RoleLane({
  slotId,
  role,
  assignments,
  requiredCount,
  constraintsMap,
  assignmentCountMap,
  onRemoveAssignment,
  conflictReport,
}: RoleLaneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: slotId });
  const filled = assignments.length;
  const isFull = filled >= requiredCount;

  // Slot-level conflicts
  const slotConflicts = getSlotConflicts(conflictReport, slotId);
  const hasErrors = slotConflicts.some(c => c.severity === 'error');
  const hasWarnings = slotConflicts.some(c => c.severity === 'warning');
  const isMissingStaff = slotConflicts.some(c => c.type === 'missing_staff');

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'rounded-lg border p-2 min-h-[60px] transition-colors',
        isOver && 'bg-primary/5 border-primary/30 ring-1 ring-primary/20',
        hasErrors && !isOver && 'border-red-300 bg-red-50/40',
        hasWarnings && !hasErrors && !isOver && 'border-amber-300 bg-amber-50/30',
        !hasErrors && !hasWarnings && isFull && 'border-emerald-200 bg-emerald-50/30',
        !hasErrors && !hasWarnings && !isFull && 'border-dashed'
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {role.name}
        </span>
        <Badge
          variant={
            hasErrors ? 'destructive' :
            isFull ? 'success' :
            filled > 0 ? 'warning' :
            'outline'
          }
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
          {assignments.map(a => {
            if (!a.soldier) return null;
            const cardConflicts = getAssignmentConflicts(conflictReport, a.soldier_id, slotId);
            const cardHasError = cardConflicts.some(c => c.severity === 'error');
            const cardHasWarning = cardConflicts.some(c => c.severity === 'warning');
            const conflictReasons = cardConflicts.map(c => c.reason);

            return (
              <SoldierCard
                key={a.id}
                soldier={a.soldier}
                assignmentId={a.id}
                assignmentCount={assignmentCountMap.get(a.soldier_id) || 0}
                hasConstraints={constraintsMap.has(a.soldier_id)}
                constraintText={constraintsMap.get(a.soldier_id)}
                onRemove={() => onRemoveAssignment(a.id)}
                compact
                hasConflictError={cardHasError}
                hasConflictWarning={cardHasWarning}
                conflictReasons={conflictReasons}
              />
            );
          })}
        </div>
      </SortableContext>
      {assignments.length === 0 && (
        <div className={cn(
          'text-[10px] text-center py-2',
          isMissingStaff ? 'text-red-400 font-medium' : 'text-muted-foreground/50'
        )}>
          {isMissingStaff ? `חסרים ${requiredCount}` : 'גרור לכאן'}
        </div>
      )}
    </div>
  );
}
