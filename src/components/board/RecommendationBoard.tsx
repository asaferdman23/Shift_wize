'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { ShiftColumn } from './ShiftColumn';
import { UnassignedPanel } from './UnassignedPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Week, WeekSlot, Role, Assignment, Soldier, AvailabilitySubmission, ShiftType } from '@/db/types';
import { SHIFT_ORDER } from '@/db/types';
import { Wand2, Loader2, Trash2, GripVertical } from 'lucide-react';

interface RecommendationBoardProps {
  week: Week;
  slots: WeekSlot[];
  roles: Role[];
  submissions: AvailabilitySubmission[];
}

export function RecommendationBoard({ week, slots, roles, submissions }: RecommendationBoardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // Build helper maps
  const constraintsMap = new Map<string, string>();
  submissions.forEach(s => {
    if (s.constraints_text) constraintsMap.set(s.soldier_id, s.constraints_text);
  });

  const assignmentCountMap = new Map<string, number>();
  assignments.forEach(a => {
    assignmentCountMap.set(a.soldier_id, (assignmentCountMap.get(a.soldier_id) || 0) + 1);
  });

  // Soldiers who submitted availability
  const submittedSoldiers = submissions
    .map(s => s.soldier)
    .filter((s): s is Soldier => !!s);

  // Find unassigned soldiers (submitted but not assigned to anything)
  const assignedSoldierIds = new Set(assignments.map(a => a.soldier_id));
  const unassignedSoldiers = submittedSoldiers.filter(s => !assignedSoldierIds.has(s.id));

  // Load assignments
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weeks/${week.id}/assignments`);
      const data = await res.json();
      setAssignments(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [week.id]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  // Generate recommendations
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Clear existing
      await fetch(`/api/weeks/${week.id}/assignments?clear=true`, { method: 'DELETE' });

      // Get recommendations
      const recRes = await fetch(`/api/weeks/${week.id}/recommend`, { method: 'POST' });
      const result = await recRes.json();

      if (result.assignments.length > 0) {
        // Create assignments
        await fetch(`/api/weeks/${week.id}/assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            result.assignments.map((a: any) => ({
              soldier_id: a.soldier_id,
              week_slot_id: a.week_slot_id,
              source: 'recommended',
            }))
          ),
        });
      }

      await fetchAssignments();
    } catch { /* ignore */ } finally {
      setGenerating(false);
    }
  };

  // Clear all
  const handleClear = async () => {
    if (!confirm('Clear all assignments?')) return;
    await fetch(`/api/weeks/${week.id}/assignments?clear=true`, { method: 'DELETE' });
    setAssignments([]);
  };

  // Remove single assignment
  const handleRemove = async (assignmentId: string) => {
    await fetch(`/api/weeks/${week.id}/assignments?id=${assignmentId}`, { method: 'DELETE' });
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Determine what was dragged and where
    const isFromUnassigned = activeIdStr.startsWith('soldier-');
    const soldierId = isFromUnassigned
      ? activeIdStr.replace('soldier-', '')
      : assignments.find(a => a.id === activeIdStr)?.soldier_id;

    if (!soldierId) return;

    // Find target slot - the over ID could be a slot ID or another assignment
    const targetSlotId = overIdStr;
    // If dropped on a slot (droppable), use it directly
    const isSlot = slots.some(s => s.id === targetSlotId);
    if (!isSlot) {
      // Maybe dropped on unassigned
      if (targetSlotId === 'unassigned') {
        // Remove from assignment
        if (!isFromUnassigned) {
          handleRemove(activeIdStr);
        }
        return;
      }
      return;
    }

    if (isFromUnassigned) {
      // Create new assignment
      const res = await fetch(`/api/weeks/${week.id}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soldier_id: soldierId,
          week_slot_id: targetSlotId,
          source: 'manual',
        }),
      });
      const newAssignment = await res.json();
      setAssignments(prev => [...prev, newAssignment]);
    } else {
      // Move existing assignment
      const res = await fetch(`/api/weeks/${week.id}/assignments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment_id: activeIdStr,
          new_slot_id: targetSlotId,
        }),
      });
      const updated = await res.json();
      setAssignments(prev =>
        prev.map(a => a.id === activeIdStr ? updated : a)
      );
    }
  };

  // Active drag item info
  const activeSoldier = activeId
    ? activeId.startsWith('soldier-')
      ? submittedSoldiers.find(s => s.id === activeId.replace('soldier-', ''))
      : assignments.find(a => a.id === activeId)?.soldier
    : null;

  const dates = [week.thursday_date, week.friday_date, week.saturday_date];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Generate Recommendations
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={assignments.length === 0}>
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
        <Badge variant="outline" className="text-xs">
          {assignments.length} assignments
        </Badge>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Unassigned panel */}
          <UnassignedPanel
            soldiers={unassignedSoldiers}
            constraintsMap={constraintsMap}
            assignmentCountMap={assignmentCountMap}
          />

          {/* Shift columns - scrollable */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-3 pb-4" style={{ minWidth: 'max-content' }}>
              {dates.map(date =>
                SHIFT_ORDER.map(shift => {
                  const daySlots = slots.filter(
                    s => s.date === date && s.shift_type === shift
                  );
                  const dayAssignments = assignments.filter(a =>
                    daySlots.some(s => s.id === a.week_slot_id)
                  );

                  return (
                    <ShiftColumn
                      key={`${date}-${shift}`}
                      date={date}
                      shiftType={shift}
                      roles={roles}
                      slots={daySlots}
                      assignments={dayAssignments}
                      constraintsMap={constraintsMap}
                      assignmentCountMap={assignmentCountMap}
                      onRemoveAssignment={handleRemove}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeSoldier && (
            <div className="drag-overlay bg-white border rounded-lg p-2 flex items-center gap-2 shadow-xl">
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {activeSoldier.first_name} {activeSoldier.last_name}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
