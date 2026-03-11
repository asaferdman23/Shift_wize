// ============================================================
// ShiftBoard Core Types
// ============================================================

export type WeekStatus = 'draft' | 'open' | 'closed' | 'published';
export type ShiftType = 'morning' | 'noon' | 'night';
export type Preference = 'available' | 'off';
export type AssignmentSource = 'manual' | 'recommended';

export const SHIFT_LABELS: Record<ShiftType, string> = {
  morning: 'Morning',
  noon: 'Noon',
  night: 'Night',
};

export const SHIFT_ORDER: ShiftType[] = ['morning', 'noon', 'night'];

export const STATUS_LABELS: Record<WeekStatus, string> = {
  draft: 'Draft',
  open: 'Open',
  closed: 'Closed',
  published: 'Published',
};

// ============================================================
// Database Models
// ============================================================

export interface Week {
  id: string;
  title: string;
  thursday_date: string; // YYYY-MM-DD
  friday_date: string;
  saturday_date: string;
  status: WeekStatus;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  created_at: string;
}

export interface WeekSlot {
  id: string;
  week_id: string;
  date: string;
  shift_type: ShiftType;
  role_id: string;
  required_count: number;
  created_at: string;
  // joined
  role?: Role;
}

export type ParticipantType = 'core' | 'reinforcement';
export type ResponseStatus = 'not_started' | 'submitted' | 'updated';

export const PARTICIPANT_LABELS: Record<ParticipantType, string> = {
  core: 'Core',
  reinforcement: 'Reinforcement',
};

export interface Soldier {
  id: string;
  first_name: string;
  last_name: string;
  personal_number: string;
  phone: string;
  car_number?: string;
  participant_type: ParticipantType;
  created_at: string;
  updated_at: string;
}

export interface WeekParticipant {
  id: string;
  week_id: string;
  soldier_id: string;
  response_status: ResponseStatus;
  created_at: string;
  updated_at: string;
  // joined
  soldier?: Soldier;
}

export interface AvailabilitySubmission {
  id: string;
  week_id: string;
  soldier_id: string;
  constraints_text?: string;
  submitted_at: string;
  updated_at: string;
  // joined
  soldier?: Soldier;
  entries?: AvailabilityEntry[];
}

export interface AvailabilityEntry {
  id: string;
  submission_id: string;
  date: string;
  shift_type: ShiftType;
  preference: Preference;
  created_at: string;
}

export interface Assignment {
  id: string;
  week_id: string;
  soldier_id: string;
  week_slot_id: string;
  source: AssignmentSource;
  created_at: string;
  // joined
  soldier?: Soldier;
  week_slot?: WeekSlot;
}

// ============================================================
// Form / UI Types
// ============================================================

export interface ParticipantSummary {
  total_expected: number;
  total_core: number;
  total_reinforcement: number;
  submitted: number;
  updated: number;
  not_started: number;
  with_constraints: number;
}

export interface MissingResponder {
  soldier: Soldier;
  participant_type: ParticipantType;
  response_status: ResponseStatus;
  last_update?: string;
}

export interface SoldierFormData {
  first_name: string;
  last_name: string;
  personal_number: string;
  phone: string;
  car_number?: string;
  constraints_text?: string;
  availability: Record<string, Record<ShiftType, Preference>>;
}

export interface RecommendationResult {
  assignments: RecommendedAssignment[];
  warnings: RecommendationWarning[];
  unfilledSlots: UnfilledSlot[];
  coverage: CoverageSummary;
}

export interface RecommendedAssignment {
  soldier_id: string;
  soldier_name: string;
  week_slot_id: string;
  date: string;
  shift_type: ShiftType;
  role_name: string;
  reason: string;
}

export interface RecommendationWarning {
  soldier_id: string;
  soldier_name: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface UnfilledSlot {
  week_slot_id: string;
  date: string;
  shift_type: ShiftType;
  role_name: string;
  required: number;
  filled: number;
}

export interface CoverageSummary {
  total_slots: number;
  filled_slots: number;
  percentage: number;
}

// Board state
export interface BoardState {
  assignments: Assignment[];
  unassigned: Soldier[];
}

export interface DragItem {
  soldier_id: string;
  from_slot_id?: string; // undefined if from unassigned
}
