# EasyPool
Sistema web/móvil para la automatización de agenda, clientes y mantenimiento de piscinas.

<br>

**Grupo**: 163

**Integrantes**:

- Tomás José Buforn,
- Maximiliano Rao,
- Eric Suarez Dubs

**Tutor**: Oscar Londero

## Entrega final

| Recurso | Enlace |
|---|---|
| Informe Final (PDF) | [docs/informe/Informe_Final_EasyPool.pdf](docs/informe/Informe_Final_EasyPool.pdf) |
| Video de presentación | https://youtu.be/ZVagtkr7ObY |
| Versión evaluada | tag `v1.0-entrega-final` |
| Sistema desplegado | https://easypool-frontend.onrender.com (ver «Cuentas de demostración») |
| Documento de análisis y diseño | [Trabajo Integrador Final.md](Trabajo%20Integrador%20Final.md) |

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

   Copiar los archivos de ejemplo y ajustar lo necesario:

   | Copiar | A | Variable | Para qué sirve |
   |---|---|---|---|
   | `.env.example` | `.env` | `DB_PORT` | Puerto en el que Docker publica PostgreSQL (5432). |
   | `backend/.env.example` | `backend/.env` | `DATABASE_URL` | Conexión a la base; usar el mismo puerto que `DB_PORT`. |
   | | | `JWT_SECRET` | Clave para firmar los tokens (usar un valor propio). |
   | | | `PORT` | Puerto de la API (por defecto 3000). |
   | `frontend/.env.example` | `frontend/.env` | `VITE_API_URL` | URL de la API (por defecto `http://localhost:3000`). Opcional. |
   | `backend/.env.test.example` | `backend/.env.test` | `DATABASE_URL`, `JWT_SECRET` | Base de datos separada para los tests. Solo se usa con `pnpm test`. |

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

Recorrido completo funcionando: el administrador crea cliente, ubicación y plan de mantenimiento → el sistema genera los servicios → el administrador asigna técnico → el técnico inicia sesión, consulta sus servicios y cambia el estado → el administrador visualiza el resultado, y ambos reciben avisos de los cambios.

Incluye:
- Autenticación con JWT y permisos por rol (administrador/técnico).
- Planes de mantenimiento (semanal, quincenal, mensual) con generación automática e idempotente de servicios.
- Asignación, reasignación, reprogramación y cancelación por parte del administrador, con control de superposición de agenda.
- Estados del servicio cambiados por el técnico desde el celular, incluido «No realizado».
- Bloqueo optimista para evitar conflictos de concurrencia entre administrador y técnico.
- Historial de cambios de estado con su actor.
- Notificaciones dentro de la aplicación (consulta automática cada 30 s y al volver a la pestaña; no es tiempo real).
- Ubicación mínima: el celular del técnico registra su posición solo al marcar «En servicio» y al finalizar, nunca de forma continua, y solo la ve el administrador. Si el técnico no da permiso, el cambio de estado igual se registra.
- 78 tests automatizados (Jest + Supertest, 10 suites): autenticación, permisos por rol, transiciones de estado, bloqueo optimista, reasignación con historial, recurrencia idempotente, notificaciones, ubicación y validaciones de API (rangos de coordenadas, recursos inexistentes, superposición de agenda).
- Migraciones incrementales de base de datos (`db/migrations/`, hasta la 012).
- Deployment: frontend y backend en Render, base de datos en Neon (ver sección "Deployment").
- Piloto simulado con datos y usuarios de prueba, medido contra el proceso manual (ver sección "Piloto simulado").

Fuera del alcance de este entregable: optimización automática de rutas, avisos en tiempo real (push o WebSockets) y validación con una empresa real. Ver las secciones «Decisiones técnicas conscientes» y «Trabajo futuro» de `Trabajo Integrador Final.md`.

Ver `Trabajo Integrador Final.md` para el detalle del modelo de dominio, reglas de estado, alcance del MVP, cronograma y resultados del piloto.

## Tests

El backend tiene 78 tests automatizados (Jest + Supertest) que cubren autenticación, permisos por rol, transiciones de estado, reasignación de técnicos, recurrencia, notificaciones y ubicación.

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

## Piloto simulado

El piloto usa 5 técnicos, 20 clientes y 20 servicios en un día (18 generados por planes semanales y 2 cargados a mano). Los resultados están en `Trabajo Integrador Final.md` (sección «Resultados del piloto») y los datos de respaldo en `docs/piloto/`.

Los scripts se ejecutan desde `backend/` y necesitan un archivo de entorno con la conexión a la base (por ejemplo `.env.production`, que no se sube al repositorio):

```bash
# Cargar técnicos, clientes y planes del piloto (la fecha es el día de la primera visita)
pnpm exec ts-node src/scripts/cargar-piloto.ts .env.production AAAA-MM-DD <contraseña de los técnicos>

# Medir operaciones críticas contra el backend desplegado (la URL va sin barra final)
pnpm exec ts-node src/scripts/medir-operaciones.ts <URL del backend> AAAA-MM-DD <email admin> <contraseña admin> <contraseña técnicos>

# Borrar todos los datos del piloto
pnpm exec ts-node src/scripts/limpiar-piloto.ts .env.production
```

Los técnicos del piloto son `piloto-tecnico1@easypool.com` a `piloto-tecnico5@easypool.com` y los clientes se llaman «Cliente Piloto N». Los datos del piloto se identifican por esos nombres, por eso `limpiar-piloto.ts` solo borra lo que los usa.


## Deployment

- Frontend: https://easypool-frontend.onrender.com
- Backend: https://easypool-backend.onrender.com
- Base de datos: PostgreSQL en Neon

> Nota: el backend gratuito de Render "duerme" tras 15 minutos sin uso — el primer pedido después de un rato puede tardar hasta un minuto en responder. Antes de usar la aplicación o de correr el script de medición, conviene abrir la URL del backend y esperar a que responda.

## Cuentas de demostración

El sistema desplegado requiere iniciar sesión. Para evaluarlo se pueden usar estas cuentas de demostración (datos de prueba, no reales):

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | admin-demo@easypool.com | 0gk9lXg4F76T |
| Técnico | tecnico-demo@easypool.com | lSY44PC6uQaU |

Los datos del sistema desplegado son simulados y pueden reiniciarse.
<br>

