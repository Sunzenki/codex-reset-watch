CREATE TABLE IF NOT EXISTS admin_login_attempts (
  client_hash TEXT PRIMARY KEY,
  window_started_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
