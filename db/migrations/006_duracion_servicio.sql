ALTER TABLE servicio ADD COLUMN duracion_minutos INTEGER;

UPDATE servicio SET duracion_minutos = 60 WHERE duracion_minutos IS NULL;

ALTER TABLE servicio
  ALTER COLUMN duracion_minutos SET NOT NULL,
  ADD CONSTRAINT servicio_duracion_positiva CHECK (duracion_minutos > 0);