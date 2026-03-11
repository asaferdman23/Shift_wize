-- Add flexible dates column to weeks table
-- This allows weeks with any number of days (not just Thu-Fri-Sat)
ALTER TABLE weeks ADD COLUMN IF NOT EXISTS dates JSONB;

-- Backfill existing rows: populate dates from the 3 hardcoded columns
UPDATE weeks
SET dates = jsonb_build_array(thursday_date::text, friday_date::text, saturday_date::text)
WHERE dates IS NULL;
