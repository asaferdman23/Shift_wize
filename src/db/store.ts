// ============================================================
// Supabase Database Store
// Replaces in-memory store with persistent Supabase backend.
// All operations are async.
// ============================================================

import { supabase } from './supabase';
import type {
  Week, Role, WeekSlot, Soldier, AvailabilitySubmission,
  AvailabilityEntry, Assignment, ShiftType, Preference, WeekStatus,
  ParticipantType, ResponseStatus, WeekParticipant, ParticipantSummary, MissingResponder,
} from './types';
import { getWeekDates } from './types';

// ---- Weeks ----
export async function getAllWeeks(): Promise<Week[]> {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getWeek(id: string): Promise<Week | undefined> {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return data;
}

export async function createWeek(data: Omit<Week, 'id' | 'created_at'>): Promise<Week> {
  // Ensure dates array is populated
  const dates = data.dates && data.dates.length > 0
    ? data.dates
    : [data.thursday_date, data.friday_date, data.saturday_date].filter(Boolean);

  const row: Record<string, unknown> = {
    title: data.title,
    status: data.status,
    dates,
    // Legacy columns: use first/mid/last dates for backward compat
    thursday_date: data.thursday_date || dates[0],
    friday_date: data.friday_date || dates[Math.min(1, dates.length - 1)],
    saturday_date: data.saturday_date || dates[dates.length - 1],
  };

  const { data: week, error } = await supabase
    .from('weeks')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return week;
}

export async function updateWeekStatus(id: string, status: WeekStatus): Promise<Week | undefined> {
  const { data, error } = await supabase
    .from('weeks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) return undefined;
  return data;
}

// ---- Roles ----
export async function getAllRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function getRole(id: string): Promise<Role | undefined> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return data;
}

export async function createRole(name: string): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Week Slots ----
export async function getWeekSlots(weekId: string): Promise<WeekSlot[]> {
  const { data, error } = await supabase
    .from('week_slots')
    .select('*, role:roles(*)')
    .eq('week_id', weekId);
  if (error) throw error;
  return data || [];
}

export async function getWeekSlot(id: string): Promise<WeekSlot | undefined> {
  const { data, error } = await supabase
    .from('week_slots')
    .select('*, role:roles(*)')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return data;
}

export async function createWeekSlot(data: Omit<WeekSlot, 'id' | 'created_at' | 'role'>): Promise<WeekSlot> {
  const { data: slot, error } = await supabase
    .from('week_slots')
    .insert({
      week_id: data.week_id,
      date: data.date,
      shift_type: data.shift_type,
      role_id: data.role_id,
      required_count: data.required_count,
    })
    .select('*, role:roles(*)')
    .single();
  if (error) throw error;
  return slot;
}

// ---- Soldiers ----
export async function getAllSoldiers(): Promise<Soldier[]> {
  const { data, error } = await supabase
    .from('soldiers')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function getSoldier(id: string): Promise<Soldier | undefined> {
  const { data, error } = await supabase
    .from('soldiers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return data;
}

export async function findSoldierByPersonalNumber(pn: string): Promise<Soldier | undefined> {
  const { data, error } = await supabase
    .from('soldiers')
    .select('*')
    .eq('personal_number', pn)
    .single();
  if (error) return undefined;
  return data;
}

export async function upsertSoldier(input: {
  first_name: string;
  last_name: string;
  personal_number: string;
  phone: string;
  car_number?: string;
  participant_type?: ParticipantType;
}): Promise<Soldier> {
  const existing = await findSoldierByPersonalNumber(input.personal_number);
  if (existing) {
    const updates: Record<string, unknown> = {
      first_name: input.first_name,
      last_name: input.last_name,
      phone: input.phone,
      updated_at: new Date().toISOString(),
    };
    if (input.car_number) updates.car_number = input.car_number;
    if (input.participant_type && existing.participant_type !== 'core') {
      updates.participant_type = input.participant_type;
    }
    const { data, error } = await supabase
      .from('soldiers')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('soldiers')
    .insert({
      first_name: input.first_name,
      last_name: input.last_name,
      personal_number: input.personal_number,
      phone: input.phone,
      car_number: input.car_number,
      participant_type: input.participant_type || 'reinforcement',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Availability Submissions ----
export async function getSubmissionsForWeek(weekId: string): Promise<AvailabilitySubmission[]> {
  const { data: subs, error } = await supabase
    .from('availability_submissions')
    .select('*, soldier:soldiers(*), entries:availability_entries(*)')
    .eq('week_id', weekId);
  if (error) throw error;
  return subs || [];
}

export async function findSubmission(weekId: string, soldierId: string): Promise<AvailabilitySubmission | undefined> {
  const { data, error } = await supabase
    .from('availability_submissions')
    .select('*, soldier:soldiers(*), entries:availability_entries(*)')
    .eq('week_id', weekId)
    .eq('soldier_id', soldierId)
    .single();
  if (error) return undefined;
  return data;
}

export async function upsertSubmission(input: {
  week_id: string;
  soldier_id: string;
  constraints_text?: string;
  availability: Record<string, Record<ShiftType, Preference>>;
}): Promise<AvailabilitySubmission> {
  const existing = await findSubmission(input.week_id, input.soldier_id);
  const isUpdate = !!existing;

  let subId: string;

  if (existing) {
    // Update existing submission
    const { error } = await supabase
      .from('availability_submissions')
      .update({
        constraints_text: input.constraints_text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) throw error;
    subId = existing.id;

    // Delete old entries
    await supabase
      .from('availability_entries')
      .delete()
      .eq('submission_id', existing.id);
  } else {
    // Create new submission
    const { data, error } = await supabase
      .from('availability_submissions')
      .insert({
        week_id: input.week_id,
        soldier_id: input.soldier_id,
        constraints_text: input.constraints_text,
      })
      .select()
      .single();
    if (error) throw error;
    subId = data.id;
  }

  // Create new entries
  const entryRows: Array<{
    submission_id: string;
    date: string;
    shift_type: string;
    preference: string;
  }> = [];
  for (const [date, shifts] of Object.entries(input.availability)) {
    for (const [shift, pref] of Object.entries(shifts)) {
      entryRows.push({
        submission_id: subId,
        date,
        shift_type: shift,
        preference: pref,
      });
    }
  }

  if (entryRows.length > 0) {
    const { error } = await supabase
      .from('availability_entries')
      .insert(entryRows);
    if (error) throw error;
  }

  // Ensure participant record and update status
  await ensureParticipant(input.week_id, input.soldier_id);
  await updateParticipantStatus(
    input.week_id,
    input.soldier_id,
    isUpdate ? 'updated' : 'submitted'
  );

  // Return the full submission
  const result = await findSubmission(input.week_id, input.soldier_id);
  return result!;
}

// ---- Week Participants ----
export async function getWeekParticipants(weekId: string): Promise<WeekParticipant[]> {
  const { data, error } = await supabase
    .from('week_participants')
    .select('*, soldier:soldiers(*)')
    .eq('week_id', weekId);
  if (error) throw error;
  return data || [];
}

export async function addWeekParticipant(weekId: string, soldierId: string): Promise<WeekParticipant> {
  // Upsert to handle duplicates
  const { data, error } = await supabase
    .from('week_participants')
    .upsert(
      { week_id: weekId, soldier_id: soldierId, response_status: 'not_started' },
      { onConflict: 'week_id,soldier_id', ignoreDuplicates: true }
    )
    .select('*, soldier:soldiers(*)')
    .single();
  if (error) {
    // If upsert with ignoreDuplicates doesn't return data, fetch it
    const { data: existing, error: e2 } = await supabase
      .from('week_participants')
      .select('*, soldier:soldiers(*)')
      .eq('week_id', weekId)
      .eq('soldier_id', soldierId)
      .single();
    if (e2) throw e2;
    return existing;
  }
  return data;
}

export async function addWeekParticipants(weekId: string, soldierIds: string[]): Promise<WeekParticipant[]> {
  const rows = soldierIds.map(sid => ({
    week_id: weekId,
    soldier_id: sid,
    response_status: 'not_started' as const,
  }));

  const { error } = await supabase
    .from('week_participants')
    .upsert(rows, { onConflict: 'week_id,soldier_id', ignoreDuplicates: true });
  if (error) throw error;

  return getWeekParticipants(weekId);
}

export async function updateParticipantStatus(weekId: string, soldierId: string, status: ResponseStatus): Promise<void> {
  await supabase
    .from('week_participants')
    .update({ response_status: status, updated_at: new Date().toISOString() })
    .eq('week_id', weekId)
    .eq('soldier_id', soldierId);
}

export async function ensureParticipant(weekId: string, soldierId: string): Promise<void> {
  await addWeekParticipant(weekId, soldierId);
}

export async function getParticipantSummary(weekId: string): Promise<ParticipantSummary> {
  const participants = await getWeekParticipants(weekId);
  const subs = await getSubmissionsForWeek(weekId);
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
    submitted: submitted + updated,
    updated,
    not_started: notStarted,
    with_constraints: withConstraints,
  };
}

export async function getMissingResponders(weekId: string): Promise<MissingResponder[]> {
  const participants = await getWeekParticipants(weekId);
  return participants
    .filter(p => p.response_status === 'not_started')
    .map(p => ({
      soldier: p.soldier!,
      participant_type: p.soldier?.participant_type || ('core' as ParticipantType),
      response_status: p.response_status,
      last_update: undefined,
    }))
    .filter(m => m.soldier);
}

export async function getRespondedParticipants(weekId: string): Promise<WeekParticipant[]> {
  const { data, error } = await supabase
    .from('week_participants')
    .select('*, soldier:soldiers(*)')
    .eq('week_id', weekId)
    .in('response_status', ['submitted', 'updated']);
  if (error) throw error;
  return data || [];
}

// ---- Assignments ----
export async function getAssignmentsForWeek(weekId: string): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*, soldier:soldiers(*), week_slot:week_slots(*, role:roles(*))')
    .eq('week_id', weekId);
  if (error) throw error;
  return data || [];
}

export async function createAssignment(data: {
  week_id: string;
  soldier_id: string;
  week_slot_id: string;
  source: 'manual' | 'recommended';
}): Promise<Assignment> {
  const { data: assignment, error } = await supabase
    .from('assignments')
    .insert(data)
    .select('*, soldier:soldiers(*), week_slot:week_slots(*, role:roles(*))')
    .single();
  if (error) throw error;
  return assignment;
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id);
  return !error;
}

export async function clearAssignmentsForWeek(weekId: string): Promise<void> {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('week_id', weekId);
  if (error) throw error;
}

export async function moveAssignment(assignmentId: string, newSlotId: string): Promise<Assignment | undefined> {
  const { data, error } = await supabase
    .from('assignments')
    .update({ week_slot_id: newSlotId, source: 'manual' })
    .eq('id', assignmentId)
    .select('*, soldier:soldiers(*), week_slot:week_slots(*, role:roles(*))')
    .single();
  if (error) return undefined;
  return data;
}

// ---- Seed Data ----

// Real slot requirements per shift type per role
interface SlotRequirement {
  roleName: string;
  morning: number;
  noon: number;
  night: number;
}

const SLOT_REQUIREMENTS: SlotRequirement[] = [
  { roleName: 'יולדות',                        morning: 4, noon: 3, night: 3 },
  { roleName: 'מטבח',                          morning: 3, noon: 3, night: 2 },
  { roleName: 'מכון הלב',                      morning: 2, noon: 2, night: 2 },
  { roleName: 'מסר',                           morning: 1, noon: 1, night: 1 },
  { roleName: 'מעלית שיקום',                    morning: 3, noon: 1, night: 0 },
  { roleName: 'סדרן חניה + מעלית שיקום',        morning: 2, noon: 0, night: 0 },
  { roleName: 'צירים',                         morning: 1, noon: 0, night: 0 },
  { roleName: 'שינוע דמים',                     morning: 2, noon: 0, night: 2 },
  { roleName: 'שיקום',                         morning: 1, noon: 0, night: 1 },
];

export async function seedDatabase(): Promise<string> {
  // Check if already seeded
  const existingWeeks = await getAllWeeks();
  if (existingWeeks.length > 0) {
    return existingWeeks[0].id;
  }

  // Use existing roles from DB (already inserted via migration)
  let existingRoles = await getAllRoles();
  if (existingRoles.length === 0) {
    // Fallback: create roles if not present
    for (const req of SLOT_REQUIREMENTS) {
      await createRole(req.roleName);
    }
    existingRoles = await getAllRoles();
  }
  const roleByName = new Map(existingRoles.map(r => [r.name, r]));

  // Week
  const week = await createWeek({
    title: 'סופ"ש 12-14.3',
    thursday_date: '2026-03-12',
    friday_date: '2026-03-13',
    saturday_date: '2026-03-14',
    dates: ['2026-03-12', '2026-03-13', '2026-03-14'],
    status: 'open',
  });

  // Create slots with correct per-role per-shift requirements
  const dates = getWeekDates(week);
  const shifts: ShiftType[] = ['morning', 'noon', 'night'];
  for (const date of dates) {
    for (const shift of shifts) {
      for (const req of SLOT_REQUIREMENTS) {
        const role = roleByName.get(req.roleName);
        if (!role) continue;
        const count = req[shift];
        if (count <= 0) continue;
        await createWeekSlot({
          week_id: week.id,
          date,
          shift_type: shift,
          role_id: role.id,
          required_count: count,
        });
      }
    }
  }

  // Core Soldiers (40)
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

  const seededCoreSoldiers: Soldier[] = [];
  for (const s of coreSoldierData) {
    seededCoreSoldiers.push(await upsertSoldier({ ...s, participant_type: 'core' }));
  }
  const seededReinforcementSoldiers: Soldier[] = [];
  for (const s of reinforcementData) {
    seededReinforcementSoldiers.push(await upsertSoldier({ ...s, participant_type: 'reinforcement' }));
  }
  const allSeededSoldiers = [...seededCoreSoldiers, ...seededReinforcementSoldiers];

  // Register ALL as expected participants
  await addWeekParticipants(week.id, allSeededSoldiers.map(s => s.id));

  // Create submissions for ~32 soldiers
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

  const dates2 = getWeekDates(week);

  // 25 core soldiers responded
  for (let i = 0; i < 25; i++) {
    const soldier = seededCoreSoldiers[i];
    const avail: Record<string, Record<ShiftType, Preference>> = {};
    for (const date of dates2) {
      avail[date] = {
        morning: Math.random() > 0.3 ? 'available' : 'off',
        noon: Math.random() > 0.4 ? 'available' : 'off',
        night: Math.random() > 0.5 ? 'available' : 'off',
      };
    }
    await upsertSubmission({
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
    for (const date of dates2) {
      avail[date] = {
        morning: Math.random() > 0.25 ? 'available' : 'off',
        noon: Math.random() > 0.35 ? 'available' : 'off',
        night: Math.random() > 0.55 ? 'available' : 'off',
      };
    }
    await upsertSubmission({
      week_id: week.id,
      soldier_id: soldier.id,
      constraints_text: constraintsOptions[(i + 3) % constraintsOptions.length],
      availability: avail,
    });
  }

  return week.id;
}

export async function getSampleWeekId(): Promise<string> {
  const weeks = await getAllWeeks();
  if (weeks.length > 0) return weeks[0].id;
  return seedDatabase();
}
