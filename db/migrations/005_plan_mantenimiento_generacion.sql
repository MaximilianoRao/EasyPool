ALTER TABLE plan_mantenimiento
  ADD COLUMN fecha_inicio TIMESTAMP,
  ADD COLUMN proxima_generacion TIMESTAMP;

UPDATE plan_mantenimiento SET fecha_inicio = now(), proxima_generacion = now() WHERE fecha_inicio IS NULL;

ALTER TABLE plan_mantenimiento
  ALTER COLUMN fecha_inicio SET NOT NULL,
  ALTER COLUMN proxima_generacion SET NOT NULL;

ALTER TABLE servicio ADD CONSTRAINT servicio_plan_fecha_unique UNIQUE (plan_id, fecha_hora);