-- Init schema for Opendex Password Reset (Neon)
-- Requires pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  fullname TEXT NOT NULL,
  department TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username_role ON users(username, role);

CREATE TABLE IF NOT EXISTS reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  role TEXT NOT NULL,
  full_name TEXT,
  department TEXT,
  position TEXT,
  account_type TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  attempt_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reset_attempts_username ON reset_attempts(username);
CREATE INDEX IF NOT EXISTS idx_reset_attempts_date ON reset_attempts(attempt_date);

