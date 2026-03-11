// ============================================================
// ShiftBoard Recommendation Engine v1
// Rules-based deterministic assignment engine
// ============================================================

import type {
  RecommendationResult,
  RecommendedAssignment,
  RecommendationWarning,
  UnfilledSlot,
  ShiftType,
  AvailabilitySubmission,
} from '@/db/types';
import {
  getWeekSlots,
  getSubmissionsForWeek,
  getAssignmentsForWeek,
  getAllRoles,
} from '@/db/store';

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

export function generateRecommendations(weekId: string): RecommendationResult {
  const slots = getWeekSlots(weekId);
  const subs = getSubmissionsForWeek(weekId);
  const existingAssignments = getAssignmentsForWeek(weekId);
  const roles = getAllRoles();

  const roleMap = new Map(roles.map(r => [r.id, r.name]));
  const warnings: RecommendationWarning[] = [];
  const recommended: RecommendedAssignment[] = [];

  // Track assignments per soldier: date -> count
  const soldierDayAssignments = new Map<string, Map<string, number>>();
  const soldierTotalAssignments = new Map<string, number>();

  // Initialize from existing assignments
  for (const a of existingAssignments) {
    if (a.week_slot) {
      const dayMap = soldierDayAssignments.get(a.soldier_id) || new Map();
      dayMap.set(a.week_slot.date, (dayMap.get(a.week_slot.date) || 0) + 1);
      soldierDayAssignments.set(a.soldier_id, dayMap);
      soldierTotalAssignments.set(a.soldier_id, (soldierTotalAssignments.get(a.soldier_id) || 0) + 1);
    }
  }

  // Track how many are filled per slot
  const slotFillCount = new Map<string, number>();
  for (const a of existingAssignments) {
    slotFillCount.set(a.week_slot_id, (slotFillCount.get(a.week_slot_id) || 0) + 1);
  }

  // Build submission lookup: soldier_id -> submission
  const subMap = new Map<string, AvailabilitySubmission>();
  for (const sub of subs) {
    subMap.set(sub.soldier_id, sub);
  }

  // Sort slots by priority: night shifts first (harder to fill), then by date
  const sortedSlots = [...slots].sort((a, b) => {
    const shiftPriority: Record<ShiftType, number> = { night: 0, noon: 1, morning: 2 };
    const pa = shiftPriority[a.shift_type];
    const pb = shiftPriority[b.shift_type];
    if (pa !== pb) return pa - pb;
    return a.date.localeCompare(b.date);
  });

  for (const slot of sortedSlots) {
    const currentFill = slotFillCount.get(slot.id) || 0;
    const needed = slot.required_count - currentFill;
    if (needed <= 0) continue;

    const roleName = roleMap.get(slot.role_id) || 'Unknown';
    const dayName = getDayName(slot.date);

    // Get candidate soldiers, sorted by fewest total assignments
    const candidates = subs
      .map(sub => ({
        sub,
        constraints: parseConstraints(sub.constraints_text),
        totalAssignments: soldierTotalAssignments.get(sub.soldier_id) || 0,
      }))
      .sort((a, b) => a.totalAssignments - b.totalAssignments);

    let filled = 0;
    for (const { sub, constraints } of candidates) {
      if (filled >= needed) break;

      const soldierId = sub.soldier_id;
      const soldierName = sub.soldier
        ? `${sub.soldier.first_name} ${sub.soldier.last_name}`
        : soldierId;

      // Check if already assigned to this slot
      const alreadyAssigned = existingAssignments.some(
        a => a.soldier_id === soldierId && a.week_slot_id === slot.id
      ) || recommended.some(
        r => r.soldier_id === soldierId && r.week_slot_id === slot.id
      );
      if (alreadyAssigned) continue;

      // Rule 1: Check availability
      const entry = sub.entries?.find(
        e => e.date === slot.date && e.shift_type === slot.shift_type
      );
      if (!entry || entry.preference === 'off') {
        continue; // Skip silently - they're not available
      }

      // Rule 2: Check constraint keywords
      if (constraints.noNight && slot.shift_type === 'night') {
        continue;
      }
      if (constraints.noKitchen && roleName.toLowerCase().includes('kitchen')) {
        continue;
      }
      if (constraints.noFriday && dayName === 'friday') {
        continue;
      }
      if (constraints.noSaturday && dayName === 'saturday') {
        continue;
      }
      if (constraints.noThursday && dayName === 'thursday') {
        continue;
      }

      // Rule 3: Avoid assigning same soldier twice on same day
      const dayMap = soldierDayAssignments.get(soldierId) || new Map();
      const dayCount = dayMap.get(slot.date) || 0;
      if (dayCount >= 1) {
        // Already has an assignment this day - skip unless no other candidates
        continue;
      }

      // Rule 4: Check not already assigned to another slot at same time
      const sameTimeAssigned = [...existingAssignments, ...recommended.map(r => ({
        soldier_id: r.soldier_id,
        week_slot_id: r.week_slot_id,
      }))].some(a => {
        if (a.soldier_id !== soldierId) return false;
        const otherSlot = slots.find(s => s.id === a.week_slot_id);
        return otherSlot && otherSlot.date === slot.date && otherSlot.shift_type === slot.shift_type;
      });
      if (sameTimeAssigned) continue;

      // Assign!
      recommended.push({
        soldier_id: soldierId,
        soldier_name: soldierName,
        week_slot_id: slot.id,
        date: slot.date,
        shift_type: slot.shift_type,
        role_name: roleName,
        reason: 'Available and fewest assignments',
      });

      // Update tracking
      dayMap.set(slot.date, dayCount + 1);
      soldierDayAssignments.set(soldierId, dayMap);
      soldierTotalAssignments.set(soldierId, (soldierTotalAssignments.get(soldierId) || 0) + 1);
      slotFillCount.set(slot.id, (slotFillCount.get(slot.id) || 0) + 1);
      filled++;
    }
  }

  // Generate warnings for soldiers with constraints
  for (const sub of subs) {
    const constraints = parseConstraints(sub.constraints_text);
    const name = sub.soldier ? `${sub.soldier.first_name} ${sub.soldier.last_name}` : sub.soldier_id;
    if (constraints.raw && constraints.raw.length > 0) {
      warnings.push({
        soldier_id: sub.soldier_id,
        soldier_name: name,
        message: `Constraint: "${constraints.raw}"`,
        severity: constraints.noNight || constraints.noFriday ? 'warning' : 'info',
      });
    }
  }

  // Calculate unfilled slots
  const unfilledSlots: UnfilledSlot[] = [];
  for (const slot of slots) {
    const filled = slotFillCount.get(slot.id) || 0;
    if (filled < slot.required_count) {
      unfilledSlots.push({
        week_slot_id: slot.id,
        date: slot.date,
        shift_type: slot.shift_type,
        role_name: roleMap.get(slot.role_id) || 'Unknown',
        required: slot.required_count,
        filled,
      });
    }
  }

  const totalRequired = slots.reduce((sum, s) => sum + s.required_count, 0);
  const totalFilled = Array.from(slotFillCount.values()).reduce((sum, c) => sum + c, 0);

  return {
    assignments: recommended,
    warnings,
    unfilledSlots,
    coverage: {
      total_slots: totalRequired,
      filled_slots: totalFilled,
      percentage: totalRequired > 0 ? Math.round((totalFilled / totalRequired) * 100) : 0,
    },
  };
}
