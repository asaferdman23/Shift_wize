// ============================================================
// ShiftBoard Conflict Detection Engine
// Detects scheduling conflicts and highlights issues
// ============================================================

import type {
  Assignment,
  WeekSlot,
  AvailabilitySubmission,
  Conflict,
  ConflictReport,
  ShiftType,
} from '@/db/types';

interface ConstraintFlags {
  noNight: boolean;
  noKitchen: boolean;
  noFriday: boolean;
  noSaturday: boolean;
  noThursday: boolean;
  preferMorning: boolean;
  raw: string;
}

function parseConstraints(text?: string): ConstraintFlags {
  const t = (text || '').toLowerCase();
  return {
    noNight: t.includes('no night'),
    noKitchen: t.includes('no kitchen'),
    noFriday: t.includes('no friday'),
    noSaturday: t.includes('no saturday') || t.includes('no shabbat'),
    noThursday: t.includes('no thursday'),
    preferMorning: t.includes('prefer morning') || t.includes('only morning'),
    raw: text || '',
  };
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][d.getDay()];
}

export function detectConflicts(
  assignments: Assignment[],
  slots: WeekSlot[],
  submissions: AvailabilitySubmission[],
  roleMap: Map<string, string>,
): ConflictReport {
  const conflicts: Conflict[] = [];

  // Build lookup maps
  const slotMap = new Map(slots.map(s => [s.id, s]));
  const subMap = new Map(submissions.map(s => [s.soldier_id, s]));

  // Helper to get soldier name
  const getName = (a: Assignment) =>
    a.soldier ? `${a.soldier.first_name} ${a.soldier.last_name}` : a.soldier_id;

  // ---- 1. Double assignment same day ----
  const soldierDaySlots = new Map<string, Map<string, Assignment[]>>();
  for (const a of assignments) {
    const slot = a.week_slot ? a.week_slot : slotMap.get(a.week_slot_id);
    if (!slot) continue;
    const key = a.soldier_id;
    if (!soldierDaySlots.has(key)) soldierDaySlots.set(key, new Map());
    const dayMap = soldierDaySlots.get(key)!;
    if (!dayMap.has(slot.date)) dayMap.set(slot.date, []);
    dayMap.get(slot.date)!.push(a);
  }

  for (const [soldierId, dayMap] of soldierDaySlots) {
    for (const [date, dayAssignments] of dayMap) {
      if (dayAssignments.length > 1) {
        const name = getName(dayAssignments[0]);
        for (const a of dayAssignments) {
          conflicts.push({
            type: 'double_assignment_same_day',
            severity: 'error',
            soldierId,
            soldierName: name,
            slotId: a.week_slot_id,
            reason: `${name} is assigned ${dayAssignments.length} times on ${date}`,
          });
        }
      }
    }
  }

  // ---- 2. Assigned despite OFF ----
  for (const a of assignments) {
    const slot = a.week_slot ? a.week_slot : slotMap.get(a.week_slot_id);
    if (!slot) continue;
    const sub = subMap.get(a.soldier_id);
    if (!sub?.entries) continue;

    const entry = sub.entries.find(
      e => e.date === slot.date && e.shift_type === slot.shift_type
    );
    if (entry && entry.preference === 'off') {
      conflicts.push({
        type: 'assigned_despite_off',
        severity: 'error',
        soldierId: a.soldier_id,
        soldierName: getName(a),
        slotId: a.week_slot_id,
        reason: `${getName(a)} marked OFF for ${slot.date} ${slot.shift_type}`,
      });
    }
  }

  // ---- 3. Constraint violations ----
  for (const a of assignments) {
    const slot = a.week_slot ? a.week_slot : slotMap.get(a.week_slot_id);
    if (!slot) continue;
    const sub = subMap.get(a.soldier_id);
    if (!sub?.constraints_text) continue;

    const flags = parseConstraints(sub.constraints_text);
    const roleName = roleMap.get(slot.role_id) || '';
    const dayName = getDayName(slot.date);
    const name = getName(a);

    if (flags.noNight && slot.shift_type === 'night') {
      conflicts.push({
        type: 'constraint_violation',
        severity: 'warning',
        soldierId: a.soldier_id,
        soldierName: name,
        slotId: a.week_slot_id,
        reason: `${name} has "no night" constraint`,
      });
    }
    if (flags.noKitchen && roleName.toLowerCase().includes('kitchen')) {
      conflicts.push({
        type: 'constraint_violation',
        severity: 'warning',
        soldierId: a.soldier_id,
        soldierName: name,
        slotId: a.week_slot_id,
        reason: `${name} has "no kitchen" constraint`,
      });
    }
    if (flags.noFriday && dayName === 'friday') {
      conflicts.push({
        type: 'constraint_violation',
        severity: 'warning',
        soldierId: a.soldier_id,
        soldierName: name,
        slotId: a.week_slot_id,
        reason: `${name} has "no friday" constraint`,
      });
    }
    if (flags.noSaturday && dayName === 'saturday') {
      conflicts.push({
        type: 'constraint_violation',
        severity: 'warning',
        soldierId: a.soldier_id,
        soldierName: name,
        slotId: a.week_slot_id,
        reason: `${name} has "no saturday" constraint`,
      });
    }
    if (flags.noThursday && dayName === 'thursday') {
      conflicts.push({
        type: 'constraint_violation',
        severity: 'warning',
        soldierId: a.soldier_id,
        soldierName: name,
        slotId: a.week_slot_id,
        reason: `${name} has "no thursday" constraint`,
      });
    }
  }

  // ---- 4. Unfair distribution ----
  const soldierCounts = new Map<string, number>();
  for (const a of assignments) {
    soldierCounts.set(a.soldier_id, (soldierCounts.get(a.soldier_id) || 0) + 1);
  }
  if (soldierCounts.size > 0) {
    const counts = Array.from(soldierCounts.values());
    const avg = counts.reduce((s, c) => s + c, 0) / counts.length;
    const threshold = Math.max(avg + 2, avg * 1.5);
    for (const [soldierId, count] of soldierCounts) {
      if (count >= threshold && count > 2) {
        const a = assignments.find(a => a.soldier_id === soldierId);
        const name = a ? getName(a) : soldierId;
        conflicts.push({
          type: 'unfair_distribution',
          severity: 'warning',
          soldierId,
          soldierName: name,
          reason: `${name} has ${count} shifts (avg: ${avg.toFixed(1)})`,
        });
      }
    }
  }

  // ---- 5. Missing staff (unfilled slots) ----
  const slotFillCount = new Map<string, number>();
  for (const a of assignments) {
    slotFillCount.set(a.week_slot_id, (slotFillCount.get(a.week_slot_id) || 0) + 1);
  }
  for (const slot of slots) {
    const filled = slotFillCount.get(slot.id) || 0;
    if (filled < slot.required_count) {
      const roleName = roleMap.get(slot.role_id) || 'Unknown';
      conflicts.push({
        type: 'missing_staff',
        severity: filled === 0 ? 'error' : 'warning',
        slotId: slot.id,
        reason: `${roleName} on ${slot.date} ${slot.shift_type}: ${filled}/${slot.required_count} filled`,
      });
    }
  }

  return {
    conflicts,
    errorCount: conflicts.filter(c => c.severity === 'error').length,
    warningCount: conflicts.filter(c => c.severity === 'warning').length,
  };
}

/** Get conflicts for a specific slot */
export function getSlotConflicts(report: ConflictReport, slotId: string): Conflict[] {
  return report.conflicts.filter(c => c.slotId === slotId);
}

/** Get conflicts for a specific soldier */
export function getSoldierConflicts(report: ConflictReport, soldierId: string): Conflict[] {
  return report.conflicts.filter(c => c.soldierId === soldierId);
}

/** Check if a soldier+slot combination has conflicts */
export function getAssignmentConflicts(
  report: ConflictReport,
  soldierId: string,
  slotId: string
): Conflict[] {
  return report.conflicts.filter(
    c => c.soldierId === soldierId && c.slotId === slotId
  );
}
