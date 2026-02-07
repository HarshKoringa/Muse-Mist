-- Add 'name' column to 'muses' table
-- Run this in your Supabase SQL editor

ALTER TABLE muses
ADD COLUMN name VARCHAR(100) NOT NULL;

-- Make sure email and phone remain UNIQUE
-- (They should already be, but this confirms the constraint structure)
CREATE UNIQUE INDEX IF NOT EXISTS idx_muses_email ON muses(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_muses_phone ON muses(phone) WHERE phone IS NOT NULL;
