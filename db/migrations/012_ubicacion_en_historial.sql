ALTER TABLE historial_estado
  ADD COLUMN latitud DOUBLE PRECISION,
  ADD COLUMN longitud DOUBLE PRECISION,
  ADD COLUMN precision_metros DOUBLE PRECISION,
  ADD CONSTRAINT historial_latitud_rango CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90),
  ADD CONSTRAINT historial_longitud_rango CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180),
  ADD CONSTRAINT historial_ubicacion_completa CHECK ((latitud IS NULL) = (longitud IS NULL));