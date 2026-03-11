-- ============================================================
-- ShiftBoard Supabase Schema
-- Run this in Supabase SQL editor to create the database
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  thursday_date DATE NOT NULL,
  friday_date DATE NOT NULL,
  saturday_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE week_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'noon', 'night')),
  role_id UUID NOT NULL REFERENCES roles(id),
  required_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE soldiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  personal_number TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  car_number TEXT,
  participant_type TEXT NOT NULL DEFAULT 'core' CHECK (participant_type IN ('core', 'reinforcement')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE week_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  soldier_id UUID NOT NULL REFERENCES soldiers(id),
  response_status TEXT NOT NULL DEFAULT 'not_started' CHECK (response_status IN ('not_started', 'submitted', 'updated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(week_id, soldier_id)
);

CREATE TABLE availability_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  soldier_id UUID NOT NULL REFERENCES soldiers(id),
  constraints_text TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(week_id, soldier_id)
);

CREATE TABLE availability_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES availability_submissions(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'noon', 'night')),
  preference TEXT NOT NULL CHECK (preference IN ('available', 'off')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  soldier_id UUID NOT NULL REFERENCES soldiers(id),
  week_slot_id UUID NOT NULL REFERENCES week_slots(id),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'recommended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_week_slots_week ON week_slots(week_id);
CREATE INDEX idx_submissions_week ON availability_submissions(week_id);
CREATE INDEX idx_submissions_soldier ON availability_submissions(soldier_id);
CREATE INDEX idx_entries_submission ON availability_entries(submission_id);
CREATE INDEX idx_assignments_week ON assignments(week_id);
CREATE INDEX idx_assignments_soldier ON assignments(soldier_id);
CREATE INDEX idx_soldiers_personal_number ON soldiers(personal_number);
CREATE INDEX idx_week_participants_week ON week_participants(week_id);
CREATE INDEX idx_week_participants_soldier ON week_participants(soldier_id);
CREATE INDEX idx_week_participants_status ON week_participants(response_status);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO roles (name) VALUES
  ('Kitchen'),
  ('Children'),
  ('Orderly'),
  ('Rehab Elevator'),
  ('Blood Transport');
