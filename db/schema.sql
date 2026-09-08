CREATE TABLE usuario (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'tecnico'))
);

CREATE TABLE cliente (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30)
);

CREATE TABLE ubicacion (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES cliente(id),
    direccion VARCHAR(255) NOT NULL,
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL
);

CREATE TABLE plan_mantenimiento (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ubicacion_id INTEGER NOT NULL REFERENCES ubicacion(id),
    frecuencia VARCHAR(20) NOT NULL CHECK (frecuencia IN ('semanal', 'quincenal', 'mensual')),
    dia_preferido VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE servicio (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ubicacion_id INTEGER NOT NULL REFERENCES ubicacion(id),
    plan_id INTEGER REFERENCES plan_mantenimiento(id),
    tecnico_id INTEGER REFERENCES usuario(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente','en_camino','en_servicio','finalizado','no_realizado','cancelado','reprogramado')),
    motivo_no_realizado VARCHAR(255),
    fecha_hora TIMESTAMP NOT NULL,
    version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE historial_estado (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    servicio_id INTEGER NOT NULL REFERENCES servicio(id),
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    actor_id INTEGER NOT NULL REFERENCES usuario(id),
    motivo VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT now()
);