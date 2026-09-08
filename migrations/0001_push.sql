CREATE TABLE IF NOT EXISTS subscriptions (
  endpoint_hash TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  locale TEXT NOT NULL,
  unsubscribe_token_hash TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(active);

CREATE TABLE IF NOT EXISTS push_events (
  event_id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS push_deliveries (
  event_id TEXT NOT NULL,
  endpoint_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  response_status INTEGER,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (event_id, endpoint_hash)
);

CREATE INDEX IF NOT EXISTS idx_deliveries_event_status ON push_deliveries(event_id, status);
