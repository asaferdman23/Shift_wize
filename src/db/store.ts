// ============================================================
// In-Memory Database Store
// For MVP: replaces Supabase with a simple in-memory store.
// All operations are synchronous and data resets on server restart.
// Structure mirrors the Supabase schema exactly for easy migration.
// ============================================================

import { v4 as uuid } from 'uuid';
import type {
  Week, Role, WeekSlot, Soldier, AvailabilitySubmission,
  AvailabilityEntry, Assignment, ShiftType, Preference, WeekStatus,
  ParticipantType, ResponseStatus, WeekParticipant, ParticipantSummary, MissingResponder,
} from './types';

// ---- Storage ----
const weeks: Map<string, Week> = new Map();
const roles: Map<string, Role> = new Map();
const weekSlots: Map<string, WeekSlot> = new Map();
const soldiers: Map<string, Soldier> = new Map();
const submissions: Map<string, AvailabilitySubmission> = new Map();
const entries: Map<string, AvailabilityEntry> = new Map();
const assignments: Map<string, Assignment> = new Map();
const weekParticipants: Map<string, WeekParticipant> = new Map();

// ---- Weeks ----
export function getAllWeeks(): Week[] {
  return Array.from(weeks.values()).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getWeek(id: string): Week | undefined {
  return weeks.get(id);
}

export function createWeek(data: Omit<Week, 'id' | 'created_at'>): Week {
  const week: Week = { ...data, id: uuid(), created_at: new Date().toISOString() };
  weeks.set(week.id, week);
  return week;
}

export function updateWeekStatus(id: string, status: WeekStatus): Week | undefined {
  const w = weeks.get(id);
  if (!w) return undefined;
  w.status = status;
  return w;
}

// ---- Roles ----
export function getAllRoles(): Role[] {
  return Array.from(roles.values());
}

export function getRole(id: string): Role | undefined {
  return roles.get(id);
}

export function createRole(name: string): Role {
  const role: Role = { id: uuid(), name, created_at: new Date().toISOString() };
  roles.set(role.id, role);
  return role;
}

// ---- Week Slots ----
export function getWeekSlots(weekId: string): WeekSlot[] {
  return Array.from(weekSlots.values())
    .filter(s => s.week_id === weekId)
    .map(s => ({ ...s, role: roles.get(s.role_id) }));
}

export function getWeekSlot(id: string): WeekSlot | undefined {
  const s = weekSlots.get(id);
  if (s) return { ...s, role: roles.get(s.role_id) };
  return undefined;
}

export function createWeekSlot(data: Omit<WeekSlot, 'id' | 'created_at' | 'role'>): WeekSlot {
  const slot: WeekSlot = { ...data, id: uuid(), created_at: new Date().toISOString() };
  weekSlots.set(slot.id, slot);
  return { ...slot, role: roles.get(slot.role_id) };
}

// ---- Soldiers ----
export function getAllSoldiers(): Soldier[] {
  return Array.from(soldiers.values());
}

export function getSoldier(id: string): Soldier | undefined {
  return soldiers.get(id);
}

export function findSoldierByPersonalNumber(pn: string): Soldier | undefined {
  return Array.from(soldiers.values()).find(s => s.personal_number === pn);
}

export function upsertSoldier(data: {
  first_name: string;
  last_name: string;
  personal_number: string;
  phone: string;
  car_number?: string;
  participant_type?: ParticipantType;
}): Soldier {
  const existing = findSoldierByPersonalNumber(data.personal_number);
  if (existing) {
    existing.first_name = data.first_name;
    existing.last_name = data.last_name;
    existing.phone = data.phone;
    existing.car_number = data.car_number || existing.car_number;
    // Only upgrade type if explicitly provided; never downgrade core → reinforcement
    if (data.participant_type && existing.participant_type !== 'core') {
      existing.participant_type = data.participant_type;
    }
    existing.updated_at = new Date().toISOString();
    return existing;
  }
  const soldier: Soldier = {
    ...data,
    participant_type: data.participant_type || 'reinforcement',
    id: uuid(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  soldiers.set(soldier.id, soldier);
  return soldier;
}

// ---- Availability Submissions ----
export function getSubmissionsForWeek(weekId: string): AvailabilitySubmission[] {
  return Array.from(submissions.values())
    .filter(s => s.week_id === weekId)
    .map(s => ({
      ...s,
      soldier: soldiers.get(s.soldier_id),
      entries: Array.from(entries.values()).filter(e => e.submission_id === s.id),
    }));
}

export function findSubmission(weekId: string, soldierId: string): AvailabilitySubmission | undefined {
  const sub = Array.from(submissions.values())
    .find(s => s.week_id === weekId && s.soldier_id === soldierId);
  if (!sub) return undefined;
  return {
    ...sub,
    soldier: soldiers.get(sub.soldier_id),
    entries: Array.from(entries.values()).filter(e => e.submission_id === sub.id),
  };
}

export function upsertSubmission(data: {
  week_id: string;
  soldier_id: string;
  constraints_text?: string;
  availability: Record<string, Record<ShiftType, Preference>>;
}): AvailabilitySubmission {
  // Find or create submission
  let sub = Array.from(submissions.values())
    .find(s => s.week_id === data.week_id && s.soldier_id === data.soldier_id);

  const isUpdate = !!sub;

  if (sub) {
    sub.constraints_text = data.constraints_text;
    sub.updated_at = new Date().toISOString();
    // Remove old entries
    for (const [eid, entry] of entries) {
      if (entry.submission_id === sub.id) entries.delete(eid);
    }
  } else {
    sub = {
      id: uuid(),
      week_id: data.week_id,
      soldier_id: data.soldier_id,
      constraints_text: data.constraints_text,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    submissions.set(sub.id, sub);
  }

  // Create entries
  for (const [date, shifts] of Object.entries(data.availability)) {
    for (const [shift, pref] of Object.entries(shifts)) {
      const entry: AvailabilityEntry = {
        id: uuid(),
        submission_id: sub.id,
        date,
        shift_type: shift as ShiftType,
        preference: pref as Preference,
        created_at: new Date().toISOString(),
      };
      entries.set(entry.id, entry);
    }
  }

  // Update participant status
  ensureParticipant(data.week_id, data.soldier_id);
  updateParticipantStatus(data.week_id, data.soldier_id, isUpdate ? 'updated' : 'submitted');

  return {
    ...sub,
    soldier: soldiers.get(sub.soldier_id),
    entries: Array.from(entries.values()).filter(e => e.submission_id === sub.id),
  };
}

// ---- Week Participants ----
export function getWeekParticipants(weekId: string): WeekParticipant[] {
  return Array.from(weekParticipants.values())
    .filter(p => p.week_id === weekId)
    .map(p => ({ ...p, soldier: soldiers.get(p.soldier_id) }));
}

export function addWeekParticipant(weekId: string, soldierId: string): WeekParticipant {
  // Check if already exists
  const existing = Array.from(weekParticipants.values())
    .find(p => p.week_id === weekId && p.soldier_id === soldierId);
  if (existing) return { ...existing, soldier: soldiers.get(existing.soldier_id) };

  const p: WeekParticipant = {
    id: uuid(),
    week_id: weekId,
    soldier_id: soldierId,
    response_status: 'not_started',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  weekParticipants.set(p.id, p);
  return { ...p, soldier: soldiers.get(soldierId) };
}

export function addWeekParticipants(weekId: string, soldierIds: string[]): WeekParticipant[] {
  return soldierIds.map(sid => addWeekParticipant(weekId, sid));
}

export function updateParticipantStatus(weekId: string, soldierId: string, status: ResponseStatus): void {
  const p = Array.from(weekParticipants.values())
    .find(wp => wp.week_id === weekId && wp.soldier_id === soldierId);
  if (p) {
    p.response_status = status;
    p.updated_at = new Date().toISOString();
  }
}

/** Ensure external soldier who fills form gets a participant record */
export function ensureParticipant(weekId: string, soldierId: string): void {
  const exists = Array.from(weekParticipants.values())
    .some(p => p.week_id === weekId && p.soldier_id === soldierId);
  if (!exists) {
    addWeekParticipant(weekId, soldierId);
  }
}

export function getParticipantSummary(weekId: string): ParticipantSummary {
  const participants = getWeekParticipants(weekId);
  const subs = getSubmissionsForWeek(weekId);
  const subSoldierIds = new Set(subs.map(s => s.soldier_id));
  const withConstraints = subs.filter(s => s.constraints_text && s.constraints_text.length > 0).length;

  let totalCore = 0;
  let totalReinforcement = 0;
  let submitted = 0;
  let updated = 0;
  let notStarted = 0;

  for (const p of participants) {
    const soldier = p.soldier;
    if (soldier?.participant_type === 'core') totalCore++;
    else totalReinforcement++;

    if (p.response_status === 'submitted') submitted++;
    else if (p.response_status === 'updated') updated++;
    else notStarted++;
  }

  return {
    total_expected: participants.length,
    total_core: totalCore,
    total_reinforcement: totalReinforcement,
    submitted: submitted + updated, // combined "responded"
    updated,
    not_started: notStarted,
    with_constraints: withConstraints,
  };
}

export function getMissingResponders(weekId: string): MissingResponder[] {
  const participants = getWeekParticipants(weekId);
  return participants
    .filter(p => p.response_status === 'not_started')
    .map(p => ({
      soldier: p.soldier!,
      participant_type: p.soldier?.participant_type || 'core',
      response_status: p.response_status,
      last_update: undefined,
    }))
    .filter(m => m.soldier); // safety
}

export function getRespondedParticipants(weekId: string): WeekParticipant[] {
  return getWeekParticipants(weekId)
    .filter(p => p.response_status === 'submitted' || p.response_status === 'updated');
}

// ---- Assignments ----
export function getAssignmentsForWeek(weekId: string): Assignment[] {
  return Array.from(assignments.values())
    .filter(a => a.week_id === weekId)
    .map(a => ({
      ...a,
      soldier: soldiers.get(a.soldier_id),
      week_slot: getWeekSlot(a.week_slot_id),
    }));
}

export function createAssignment(data: {
  week_id: string;
  soldier_id: string;
  week_slot_id: string;
  source: 'manual' | 'recommended';
}): Assignment {
  const assignment: Assignment = {
    ...data,
    id: uuid(),
    created_at: new Date().toISOString(),
  };
  assignments.set(assignment.id, assignment);
  return {
    ...assignment,
    soldier: soldiers.get(data.soldier_id),
    week_slot: getWeekSlot(data.week_slot_id),
  };
}

export function deleteAssignment(id: string): boolean {
  return assignments.delete(id);
}

export function clearAssignmentsForWeek(weekId: string): void {
  for (const [aid, a] of assignments) {
    if (a.week_id === weekId) assignments.delete(aid);
  }
}

export function moveAssignment(assignmentId: string, newSlotId: string): Assignment | undefined {
  const a = assignments.get(assignmentId);
  if (!a) return undefined;
  a.week_slot_id = newSlotId;
  a.source = 'manual';
  return { ...a, soldier: soldiers.get(a.soldier_id), week_slot: getWeekSlot(newSlotId) };
}

// ---- Seed Data ----
export function seedDatabase(): string {
  // Check if already seeded
  if (weeks.size > 0) {
    return Array.from(weeks.values())[0].id;
  }

  // Roles
  const roleNames = ['Kitchen', 'Children', 'Orderly', 'Rehab Elevator', 'Blood Transport'];
  const seededRoles = roleNames.map(name => createRole(name));

  // Week
  const week = createWeek({
    title: '13-15.3 Weekend',
    thursday_date: '2025-03-13',
    friday_date: '2025-03-14',
    saturday_date: '2025-03-15',
    status: 'open',
  });

  // Create slots for each day × shift × role
  const dates = [week.thursday_date, week.friday_date, week.saturday_date];
  const shifts: ShiftType[] = ['morning', 'noon', 'night'];
  for (const date of dates) {
    for (const shift of shifts) {
      for (const role of seededRoles) {
        createWeekSlot({
          week_id: week.id,
          date,
          shift_type: shift,
          role_id: role.id,
          required_count: shift === 'night' ? 1 : 2,
        });
      }
    }
  }

  // ---- Core Soldiers (40) ----
  const coreSoldierData = [
    { first_name: 'Yossi', last_name: 'Cohen', personal_number: '8001001', phone: '050-1111111' },
    { first_name: 'David', last_name: 'Levi', personal_number: '8001002', phone: '050-2222222' },
    { first_name: 'Avi', last_name: 'Mizrahi', personal_number: '8001003', phone: '050-3333333' },
    { first_name: 'Moshe', last_name: 'Peretz', personal_number: '8001004', phone: '050-4444444' },
    { first_name: 'Eitan', last_name: 'Shapira', personal_number: '8001005', phone: '050-5555555' },
    { first_name: 'Noam', last_name: 'Ben David', personal_number: '8001006', phone: '050-6666666' },
    { first_name: 'Oren', last_name: 'Goldberg', personal_number: '8001007', phone: '050-7777777' },
    { first_name: 'Tal', last_name: 'Avrami', personal_number: '8001008', phone: '050-8888888' },
    { first_name: 'Guy', last_name: 'Rosen', personal_number: '8001009', phone: '050-9999999' },
    { first_name: 'Amir', last_name: 'Katz', personal_number: '8001010', phone: '050-1010101' },
    { first_name: 'Ron', last_name: 'Shimoni', personal_number: '8001011', phone: '050-1111112' },
    { first_name: 'Yaniv', last_name: 'Hadad', personal_number: '8001012', phone: '050-1212121' },
    { first_name: 'Shai', last_name: 'Friedman', personal_number: '8001013', phone: '050-1313131' },
    { first_name: 'Nir', last_name: 'Yosef', personal_number: '8001014', phone: '050-1414141' },
    { first_name: 'Ido', last_name: 'Navon', personal_number: '8001015', phone: '050-1515151' },
    { first_name: 'Dan', last_name: 'Alon', personal_number: '8001016', phone: '050-1616161' },
    { first_name: 'Gilad', last_name: 'Baruch', personal_number: '8001017', phone: '050-1717171' },
    { first_name: 'Itay', last_name: 'Stern', personal_number: '8001018', phone: '050-1818181' },
    { first_name: 'Lior', last_name: 'Dahan', personal_number: '8001019', phone: '050-1919191' },
    { first_name: 'Omri', last_name: 'Levy', personal_number: '8001020', phone: '050-2020202' },
    { first_name: 'Tomer', last_name: 'Azulay', personal_number: '8001021', phone: '050-2121211' },
    { first_name: 'Yonatan', last_name: 'Sharabi', personal_number: '8001022', phone: '050-2222212' },
    { first_name: 'Roei', last_name: 'Biton', personal_number: '8001023', phone: '050-2323231' },
    { first_name: 'Amit', last_name: 'Gabay', personal_number: '8001024', phone: '050-2424241' },
    { first_name: 'Elad', last_name: 'Ohana', personal_number: '8001025', phone: '050-2525251' },
    { first_name: 'Barak', last_name: 'Malka', personal_number: '8001026', phone: '050-2626261' },
    { first_name: 'Dor', last_name: 'Tzur', personal_number: '8001027', phone: '050-2727271' },
    { first_name: 'Nadav', last_name: 'Haim', personal_number: '8001028', phone: '050-2828281' },
    { first_name: 'Shachar', last_name: 'Ofer', personal_number: '8001029', phone: '050-2929291' },
    { first_name: 'Yuval', last_name: 'Naor', personal_number: '8001030', phone: '050-3030301' },
    { first_name: 'Ori', last_name: 'Sasson', personal_number: '8001031', phone: '050-3131311' },
    { first_name: 'Ariel', last_name: 'Shalom', personal_number: '8001032', phone: '050-3232321' },
    { first_name: 'Matan', last_name: 'Avital', personal_number: '8001033', phone: '050-3333312' },
    { first_name: 'Ofir', last_name: 'Harel', personal_number: '8001034', phone: '050-3434341' },
    { first_name: 'Sagiv', last_name: 'Edri', personal_number: '8001035', phone: '050-3535351' },
    { first_name: 'Yarden', last_name: 'Ben Ami', personal_number: '8001036', phone: '050-3636361' },
    { first_name: 'Liron', last_name: 'Rubin', personal_number: '8001037', phone: '050-3737371' },
    { first_name: 'Neria', last_name: 'Azran', personal_number: '8001038', phone: '050-3838381' },
    { first_name: 'Asaf', last_name: 'Tal', personal_number: '8001039', phone: '050-3939391' },
    { first_name: 'Erez', last_name: 'Golan', personal_number: '8001040', phone: '050-4040401' },
  ];

  // ---- Reinforcement Soldiers (15) ----
  const reinforcementData = [
    { first_name: 'Maya', last_name: 'Abergel', personal_number: '9001001', phone: '052-5010101' },
    { first_name: 'Chen', last_name: 'Vaknin', personal_number: '9001002', phone: '052-5020201' },
    { first_name: 'Shira', last_name: 'Dayan', personal_number: '9001003', phone: '052-5030301' },
    { first_name: 'Noa', last_name: 'Benita', personal_number: '9001004', phone: '052-5040401' },
    { first_name: 'Yael', last_name: 'Alfasi', personal_number: '9001005', phone: '052-5050501' },
    { first_name: 'Hadar', last_name: 'Sabag', personal_number: '9001006', phone: '052-5060601' },
    { first_name: 'Tamir', last_name: 'Amsalem', personal_number: '9001007', phone: '052-5070701' },
    { first_name: 'Bar', last_name: 'Zohar', personal_number: '9001008', phone: '052-5080801' },
    { first_name: 'Gal', last_name: 'Revivo', personal_number: '9001009', phone: '052-5090901' },
    { first_name: 'Stav', last_name: 'Harush', personal_number: '9001010', phone: '052-5101001' },
    { first_name: 'Dean', last_name: 'Suissa', personal_number: '9001011', phone: '052-5111101' },
    { first_name: 'Tom', last_name: 'Azulay', personal_number: '9001012', phone: '052-5121201' },
    { first_name: 'Rina', last_name: 'Zaguri', personal_number: '9001013', phone: '052-5131301' },
    { first_name: 'Shaked', last_name: 'Mor', personal_number: '9001014', phone: '052-5141401' },
    { first_name: 'Magen', last_name: 'Levi', personal_number: '9001015', phone: '052-5151501' },
  ];

  const seededCoreSoldiers = coreSoldierData.map(s => upsertSoldier({ ...s, participant_type: 'core' }));
  const seededReinforcementSoldiers = reinforcementData.map(s => upsertSoldier({ ...s, participant_type: 'reinforcement' }));
  const allSeededSoldiers = [...seededCoreSoldiers, ...seededReinforcementSoldiers];

  // Register ALL as expected participants for this week
  addWeekParticipants(week.id, allSeededSoldiers.map(s => s.id));

  // Create submissions for ~30 out of 55 (realistic response rate)
  const constraintsOptions = [
    undefined,
    'no night shifts please',
    'no kitchen duty',
    'only available friday morning',
    'no friday - religious reasons',
    'prefer morning shifts',
    'can do any shift',
    'no night, no kitchen',
    'medical appointment thursday afternoon',
    undefined,
    undefined,
    'not friday night',
  ];

  // 25 core soldiers responded
  for (let i = 0; i < 25; i++) {
    const soldier = seededCoreSoldiers[i];
    const avail: Record<string, Record<ShiftType, Preference>> = {};
    for (const date of dates) {
      avail[date] = {
        morning: Math.random() > 0.3 ? 'available' : 'off',
        noon: Math.random() > 0.4 ? 'available' : 'off',
        night: Math.random() > 0.5 ? 'available' : 'off',
      };
    }
    upsertSubmission({
      week_id: week.id,
      soldier_id: soldier.id,
      constraints_text: constraintsOptions[i % constraintsOptions.length],
      availability: avail,
    });
  }

  // 7 reinforcement soldiers responded
  for (let i = 0; i < 7; i++) {
    const soldier = seededReinforcementSoldiers[i];
    const avail: Record<string, Record<ShiftType, Preference>> = {};
    for (const date of dates) {
      avail[date] = {
        morning: Math.random() > 0.25 ? 'available' : 'off',
        noon: Math.random() > 0.35 ? 'available' : 'off',
        night: Math.random() > 0.55 ? 'available' : 'off',
      };
    }
    upsertSubmission({
      week_id: week.id,
      soldier_id: soldier.id,
      constraints_text: constraintsOptions[(i + 3) % constraintsOptions.length],
      availability: avail,
    });
  }

  return week.id;
}

// Auto-seed on import
let _sampleWeekId: string | null = null;
export function getSampleWeekId(): string {
  if (!_sampleWeekId) {
    _sampleWeekId = seedDatabase();
  }
  return _sampleWeekId;
}
