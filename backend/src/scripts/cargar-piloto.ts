import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';

const archivoEnv = process.argv[2];
const fechaPiloto = process.argv[3];
const password = process.argv[4];

if (!archivoEnv || !fechaPiloto || !password || !/^\d{4}-\d{2}-\d{2}$/.test(fechaPiloto)) {
  console.error('Uso: ts-node src/scripts/cargar-piloto.ts <archivo .env> <fecha AAAA-MM-DD> <contraseña de los técnicos>');
  process.exit(1);
}

dotenv.config({ path: archivoEnv });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

const CANTIDAD_TECNICOS = 5;
const CANTIDAD_CLIENTES = 20;
const CANTIDAD_PLANES = 18; // 90% recurrente (supuesto del equipo); los otros 2 servicios se cargan a mano
const HORARIOS = ['08:00', '10:00', '13:00', '15:00'];

async function cargarPiloto() {
  const existente = await pool.query("SELECT id FROM usuario WHERE email = 'piloto-tecnico1@easypool.com'");
  if ((existente.rowCount ?? 0) > 0) {
    console.error('Los datos del piloto ya están cargados. Ejecutá primero limpiar-piloto.ts');
    await pool.end();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');

    for (let i = 1; i <= CANTIDAD_TECNICOS; i++) {
      await conexion.query(
        'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
        [`Técnico Piloto ${i}`, `piloto-tecnico${i}@easypool.com`, passwordHash, 'tecnico']
      );
    }

    for (let i = 0; i < CANTIDAD_CLIENTES; i++) {
      const numero = i + 1;
      // Coordenadas simuladas repartidas por la ciudad de Córdoba (no son direcciones reales)
      const latitud = -31.42 + 0.06 * Math.sin(numero * 2.1);
      const longitud = -64.19 + 0.07 * Math.cos(numero * 1.7);

      const cliente = await conexion.query(
        'INSERT INTO cliente (nombre, telefono) VALUES ($1, $2) RETURNING id',
        [`Cliente Piloto ${numero}`, `351000${String(numero).padStart(4, '0')}`]
      );

      const ubicacion = await conexion.query(
        'INSERT INTO ubicacion (cliente_id, direccion, latitud, longitud) VALUES ($1, $2, $3, $4) RETURNING id',
        [cliente.rows[0].id, `Dirección simulada ${numero}`, latitud, longitud]
      );

      if (i < CANTIDAD_PLANES) {
        const horario = HORARIOS[i % HORARIOS.length];
        await conexion.query(
          `INSERT INTO plan_mantenimiento (ubicacion_id, frecuencia, fecha_inicio, proxima_generacion, duracion_minutos, activo)
           VALUES ($1, 'semanal', $2, $2, 60, true)`,
          [ubicacion.rows[0].id, `${fechaPiloto}T${horario}:00`]
        );
      }
    }

    await conexion.query('COMMIT');
    console.log(`Piloto cargado: ${CANTIDAD_TECNICOS} técnicos, ${CANTIDAD_CLIENTES} clientes con su ubicación y ${CANTIDAD_PLANES} planes semanales con primera visita el ${fechaPiloto}.`);
    console.log('Los clientes sin plan (Cliente Piloto 19 y 20) se cargan a mano durante la prueba.');
  } catch (error) {
    await conexion.query('ROLLBACK');
    console.error('Error al cargar los datos del piloto:', error);
    process.exitCode = 1;
  } finally {
    conexion.release();
    await pool.end();
  }
}

cargarPiloto();