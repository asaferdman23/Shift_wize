'use client';

import { RoleLane } from './RoleLane';
import { Badge } from '@/components/ui/badge';
import type { Role, Assignment, WeekSlot } from '@/db/types';
import { SHIFT_LABELS } from '@/db/types';
import { formatDate, getShiftEmoji } from '@/lib/utils';

interface ShiftColumnProps {
  date: string;
  shiftType: string;
  roles: Role[];
  slots: WeekSlot[];
  assignments: Assignment[];
  constraintsMap: Map<string, string>;
  assignmentCountMap: Map<string, number>;
  onRemoveAssignment: (id: string) => void;
}

export function ShiftColumn({
  date,
  shiftType,
  roles,
  slots,
  assignments,
  constraintsMap,
  assignmentCountMap,
  onRemoveAssignment,
}: ShiftColumnProps) {
  const totalRequired = slots.reduce((s, sl) => s + sl.required_count, 0);
  const totalFilled = assignments.length;

  return (
    <div className="bg-white rounded-xl border shadow-sm min-w-[220px] flex-shrink-0">
      {/* Column header */}
      <div className="p-3 border-b bg-muted/20 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{formatDate(date)}</div>
            <div className="font-semibold text-sm flex items-center gap-1.5">
              {getShiftEmoji(shiftType)} {SHIFT_LABELS[shiftType as keyof typeof SHIFT_LABELS]}
            </div>
          </div>
          <Badge
            variant={totalFilled >= totalRequired ? 'success' : totalFilled > 0 ? 'warning' : 'outline'}
            className="text-[10px]"
          >
            {totalFilled}/{totalRequired}
          </Badge>
        </div>
      </div>

      {/* Role lanes */}
      <div className="p-2 space-y-2">
        {roles.map(role => {
          const slot = slots.find(s => s.role_id === role.id);
          if (!slot) return null;
          const slotAssignments = assignments.filter(a => a.week_slot_id === slot.id);

          return (
            <RoleLane
              key={slot.id}
              slotId={slot.id}
              role={role}
              assignments={slotAssignments}
              requiredCount={slot.required_count}
              constraintsMap={constraintsMap}
              assignmentCountMap={assignmentCountMap}
              onRemoveAssignment={onRemoveAssignment}
            />
          );
        })}
      </div>
    </div>
  );
}
