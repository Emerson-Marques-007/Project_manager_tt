-- Registro de pedidos de código por IP (hash), usado para limitar abuso do envio de e-mails.
CREATE TABLE IF NOT EXISTS auth_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_requests_ip_idx ON auth_requests(ip_hash, created_at);
CREATE INDEX IF NOT EXISTS auth_codes_created_idx ON auth_codes(user_id, created_at);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);
