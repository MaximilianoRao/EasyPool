ALTER TABLE historial_estado
  ADD COLUMN tecnico_anterior_id INTEGER REFERENCES usuario(id),
  ADD COLUMN tecnico_nuevo_id INTEGER REFERENCES usuario(id),
  ADD COLUMN fecha_anterior TIMESTAMP,
  ADD COLUMN fecha_nueva TIMESTAMP;