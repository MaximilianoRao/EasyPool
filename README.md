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

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar que las tablas se crearon:

```bash
docker compose exec db psql -U easypool -d easypool -c "\dt"
```

> Si cambian el `db/schema.sql`, hay que resetear el volumen para que se vuelva a aplicar: `docker compose down -v && docker compose up -d`.

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

Spike técnico completado: login → endpoint protegido (JWT) → frontend consume la API → datos persistidos en PostgreSQL.

Ver `Trabajo Integrador Final.md` para el detalle del modelo de dominio, reglas de estado, alcance del MVP y cronograma.

<br>

