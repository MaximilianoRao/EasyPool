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


## Estado actual

Recorrido vertical completo funcionando: administrador crea cliente/ubicación → crea servicio → asigna técnico → técnico inicia sesión → consulta sus servicios → cambia estado (incluyendo cancelación y reprogramación por parte del administrador) → administrador visualiza el resultado.

Incluye:
- Autenticación con JWT y permisos por rol (administrador/técnico).
- Bloqueo optimista para evitar conflictos de concurrencia entre administrador y técnico.
- 19 tests automatizados (Jest + Supertest) sobre autenticación, permisos, transiciones de estado y reasignación.
- Migraciones incrementales de base de datos (`db/migrations/`).
- Deployment funcionando: frontend y backend en Render, base de datos en Neon (ver sección "Deployment" más abajo).

Pendiente para una etapa posterior (según cronograma): recurrencia de servicios (Planes de Mantenimiento), estado "No Realizado" en la interfaz del técnico, ruteo y notificaciones.

Ver `Trabajo Integrador Final.md` para el detalle del modelo de dominio, reglas de estado, alcance del MVP y cronograma.

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

## Deployment

- Frontend: https://easypool-frontend.onrender.com
- Backend: https://easypool-backend.onrender.com
- Base de datos: PostgreSQL en Neon

> Nota: el backend gratuito de Render "duerme" tras 15 minutos sin uso — el primer pedido después de un rato puede tardar hasta un minuto en responder.

Las credenciales de este deployment no están documentadas públicamente por seguridad; contactar al equipo si se necesitan para la revisión.

<br>

