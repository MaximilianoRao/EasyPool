ALTER TABLE servicio DROP CONSTRAINT servicio_estado_check;

ALTER TABLE servicio ADD CONSTRAINT servicio_estado_check
  CHECK (estado IN ('pendiente', 'en_camino', 'en_servicio', 'finalizado', 'no_realizado', 'cancelado'));