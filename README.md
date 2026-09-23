# EasyPool
Sistema web/móvil para la automatización de agenda, clientes y mantenimiento de piscinas.

<br>

**Grupo**: 163

**Integrantes**:

- Tomás José Buforn,
- Maximiliano Rao,
- Eric Suarez Dubs

**Tutor**: Oscar Londero


## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL (vía Docker)
- **Gestor de paquetes**: pnpm (usar el mismo en todo el proyecto para evitar conflictos entre `package-lock.json` y `pnpm-lock.yaml`)

## Requisitos

- Node.js
- Docker y Docker Compose
- pnpm (`npm install -g pnpm` si no lo tenés)

## Cómo levantar el proyecto

### 1. Variables de entorno

Copiar `.env.example` a `.env` en la raíz, y `backend/.env.example` a `backend/.env`, ajustando el puerto si ya tenés algo corriendo en el 5432.

### 2. Base de datos

Desde la raíz del proyecto, levantar el contenedor de PostgreSQL:

```bash
docker compose up -d
```

Aplicar las migraciones (crea las tablas si es la primera vez, o aplica solo los cambios pendientes si la base ya existe):

```bash
cd backend
pnpm run migrate
```

> Las migraciones viven en `db/migrations/`, numeradas en orden (`001_init.sql`, `002_...`). Nunca se modifican una vez aplicadas: un cambio de esquema siempre se agrega como un archivo nuevo. El script lleva registro de lo ya aplicado en la tabla `schema_migrations`, así que correr `pnpm run migrate` de nuevo no reaplica nada ni destruye datos existentes.

### 3. Backend

```bash
cd backend
pnpm install
pnpm dev
```

Corre en `http://localhost:3000`.

Para crear el primer usuario administrador (una sola vez):

```bash
pnpm exec ts-node src/scripts/crear-admin.ts
```

Usuario de prueba: `admin@easypool.com` / `admin123`.

### 4. Frontend

En otra terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

Corre en `http://localhost:5173`.


## Tests

El backend tiene tests automatizados (Jest + Supertest) que cubren autenticación, permisos por rol, transiciones de estado y reasignación de técnicos.

Requieren una base de datos separada para no afectar los datos de desarrollo. Crear la base de test (una sola vez) y aplicar las migraciones:

```bash
docker compose exec db psql -U easypool -c "CREATE DATABASE easypool_test;"
cd backend
pnpm run migrate:test
```

Configurar `backend/.env.test` con la conexión a esa base (ver `backend/.env.example`).

Correr los tests:

```bash
pnpm test
```

## Estado actual

Spike técnico completado: login → endpoint protegido (JWT) → frontend consume la API → datos persistidos en PostgreSQL.

Ver `Trabajo Integrador Final.md` para el detalle del modelo de dominio, reglas de estado, alcance del MVP y cronograma.

<br>

