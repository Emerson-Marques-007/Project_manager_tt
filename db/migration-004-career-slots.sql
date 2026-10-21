-- Guarda o slot (1 a 3) de cada carreira, em vez de deduzi-lo pela ordem de criação.
ALTER TABLE careers
  ADD COLUMN IF NOT EXISTS slot SMALLINT;

-- Carreiras já existentes: mantém a ordem atual (mais antiga = slot 1).
WITH ordenadas AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS n
  FROM careers
  WHERE slot IS NULL
)
UPDATE careers c
SET slot = LEAST(o.n, 3)
FROM ordenadas o
WHERE c.id = o.id;

-- Se algum usuário tinha mais de 3 carreiras, remove as excedentes (sempre as mais novas após a 3ª).
DELETE FROM careers c
USING (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, slot ORDER BY created_at) AS dup
  FROM careers
) d
WHERE c.id = d.id AND d.dup > 1;

ALTER TABLE careers
  ALTER COLUMN slot SET NOT NULL;

ALTER TABLE careers
  ADD CONSTRAINT careers_slot_range CHECK (slot BETWEEN 1 AND 3);

CREATE UNIQUE INDEX IF NOT EXISTS careers_user_slot_idx ON careers(user_id, slot);
