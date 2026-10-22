CREATE TABLE notificacion (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    servicio_id INTEGER REFERENCES servicio(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT false,
    creada_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notificacion_usuario ON notificacion (usuario_id, leida);