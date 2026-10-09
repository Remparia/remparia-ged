CREATE TABLE IF NOT EXISTS cookie_consents (
  id uuid PRIMARY KEY,
  visitor_id text NOT NULL,
  necessary boolean NOT NULL DEFAULT true,
  analytics boolean NOT NULL DEFAULT false,
  marketing boolean NOT NULL DEFAULT false,
  decision text NOT NULL CHECK (decision IN ('accept_all', 'reject_all', 'custom')),
  policy_version text NOT NULL,
  locale text,
  user_agent text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cookie_consents_created_idx ON cookie_consents (created_at DESC);
CREATE INDEX IF NOT EXISTS cookie_consents_visitor_idx ON cookie_consents (visitor_id, created_at DESC);
