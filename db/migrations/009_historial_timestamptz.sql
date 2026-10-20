ALTER TABLE historial_estado
  ALTER COLUMN "timestamp" TYPE TIMESTAMPTZ
  USING "timestamp" AT TIME ZONE 'UTC';