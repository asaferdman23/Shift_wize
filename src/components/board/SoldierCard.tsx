'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import type { Soldier } from '@/db/types';
import { GripVertical, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoldierCardProps {
  soldier: Soldier;
  assignmentId?: string;
  assignmentCount?: number;
  hasConstraints?: boolean;
  constraintText?: string;
  isAvailable?: boolean;
  onRemove?: () => void;
  compact?: boolean;
  hasConflictError?: boolean;
  hasConflictWarning?: boolean;
  conflictReasons?: string[];
}

export function SoldierCard({
  soldier,
  assignmentId,
  assignmentCount = 0,
  hasConstraints,
  isAvailable = true,
  onRemove,
  compact,
  hasConflictError,
  hasConflictWarning,
  conflictReasons,
}: SoldierCardProps) {
  const dragId = assignmentId || `soldier-${soldier.id}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dragId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 border rounded-lg cursor-grab active:cursor-grabbing',
        'hover:shadow-md transition-shadow',
        isDragging && 'opacity-40 shadow-lg',
        !isAvailable && 'opacity-60 border-dashed',
        hasConflictError
          ? 'bg-red-50 border-red-300 ring-1 ring-red-200'
          : hasConflictWarning
          ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200'
          : 'bg-white',
        compact ? 'p-1.5' : 'p-2'
      )}
      title={conflictReasons?.join('\n') || undefined}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
      {/* Conflict indicator */}
      {hasConflictError && (
        <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
      )}
      {!hasConflictError && hasConflictWarning && (
        <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'font-medium truncate',
            compact ? 'text-xs' : 'text-sm',
            hasConflictError && 'text-red-800',
            hasConflictWarning && !hasConflictError && 'text-amber-800',
          )}>
            {soldier.first_name} {soldier.last_name}
          </span>
          {hasConstraints && !hasConflictError && !hasConflictWarning && (
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-muted-foreground">{soldier.personal_number}</span>
            {soldier.participant_type === 'reinforcement' && (
              <Badge variant="warning" className="text-[9px] px-1 py-0">תגבור</Badge>
            )}
            {assignmentCount > 0 && (
              <Badge variant="outline" className="text-[9px] px-1 py-0">{assignmentCount} משמרות</Badge>
            )}
          </div>
        )}
      </div>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 transition-opacity"
        >
          <X className="w-3 h-3 text-destructive" />
        </button>
      )}
    </div>
  );
}
