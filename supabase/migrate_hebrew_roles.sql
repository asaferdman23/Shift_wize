-- ============================================================
-- Migration: Replace English roles with Hebrew hospital stands
-- Run in Supabase SQL Editor
-- ============================================================

-- Delete old English roles (cascade will clean week_slots if any)
DELETE FROM week_slots;
DELETE FROM assignments;
DELETE FROM roles;

-- Insert real Hebrew roles
INSERT INTO roles (name) VALUES
  ('יולדות'),
  ('מטבח'),
  ('מכון הלב'),
  ('מסר'),
  ('מעלית שיקום'),
  ('סדרן חניה + מעלית שיקום'),
  ('צירים'),
  ('שינוע דמים'),
  ('שיקום');
