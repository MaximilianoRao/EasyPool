ALTER TABLE plan_mantenimiento ADD COLUMN duracion_minutos INTEGER;

UPDATE plan_mantenimiento SET duracion_minutos = 60 WHERE duracion_minutos IS NULL;

ALTER TABLE plan_mantenimiento
  ALTER COLUMN duracion_minutos SET NOT NULL,
  ADD CONSTRAINT plan_duracion_positiva CHECK (duracion_minutos > 0);