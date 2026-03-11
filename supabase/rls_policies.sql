-- ============================================================
-- Row Level Security Policies
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE soldiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- These policies allow the anon key (public) read-only access
-- to published schedules only. All writes go through service_role.

-- Roles: public can read (needed for form display)
CREATE POLICY "roles_read" ON roles FOR SELECT USING (true);

-- Weeks: public can read open/published weeks
CREATE POLICY "weeks_read" ON weeks FOR SELECT
  USING (status IN ('open', 'published'));

-- Week slots: public can read slots for open/published weeks
CREATE POLICY "week_slots_read" ON week_slots FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM weeks WHERE weeks.id = week_slots.week_id
    AND weeks.status IN ('open', 'published')
  ));

-- Soldiers: no public access (service_role only)
CREATE POLICY "soldiers_service_only" ON soldiers FOR ALL
  USING (false);

-- Week participants: no public access
CREATE POLICY "participants_service_only" ON week_participants FOR ALL
  USING (false);

-- Submissions: no public access
CREATE POLICY "submissions_service_only" ON availability_submissions FOR ALL
  USING (false);

-- Entries: no public access
CREATE POLICY "entries_service_only" ON availability_entries FOR ALL
  USING (false);

-- Assignments: public can read for published weeks (schedule view)
CREATE POLICY "assignments_read_published" ON assignments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM weeks WHERE weeks.id = assignments.week_id
    AND weeks.status = 'published'
  ));
