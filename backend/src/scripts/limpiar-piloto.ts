import dotenv from 'dotenv';
import { Pool } from 'pg';

const archivoEnv = process.argv[2];

if (!archivoEnv) {
  console.error('Uso: ts-node src/scripts/limpiar-piloto.ts <archivo .env>');
  process.exit(1);
}

dotenv.config({ path: archivoEnv });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

const CLIENTES_PILOTO = `SELECT id FROM cliente WHERE nombre LIKE 'Cliente Piloto %'`;
const UBICACIONES_PILOTO = `SELECT id FROM ubicacion WHERE cliente_id IN (${CLIENTES_PILOTO})`;
const SERVICIOS_PILOTO = `SELECT id FROM servicio WHERE ubicacion_id IN (${UBICACIONES_PILOTO})`;
const TECNICOS_PILOTO = `SELECT id FROM usuario WHERE email LIKE 'piloto-tecnico%@easypool.com'`;

async function limpiarPiloto() {
  const conexion = await pool.connect();

  try {
    await conexion.query('BEGIN');

    await conexion.query(`DELETE FROM historial_estado WHERE servicio_id IN (${SERVICIOS_PILOTO})`);
    await conexion.query(`DELETE FROM servicio WHERE ubicacion_id IN (${UBICACIONES_PILOTO})`);
    await conexion.query(`DELETE FROM plan_mantenimiento WHERE ubicacion_id IN (${UBICACIONES_PILOTO})`);
    await conexion.query(`DELETE FROM ubicacion WHERE cliente_id IN (${CLIENTES_PILOTO})`);
    await conexion.query(`DELETE FROM cliente WHERE nombre LIKE 'Cliente Piloto %'`);
    await conexion.query(
      `DELETE FROM historial_estado
       WHERE actor_id IN (${TECNICOS_PILOTO})
          OR tecnico_anterior_id IN (${TECNICOS_PILOTO})
          OR tecnico_nuevo_id IN (${TECNICOS_PILOTO})`
    );
    const tecnicos = await conexion.query(`DELETE FROM usuario WHERE email LIKE 'piloto-tecnico%@easypool.com'`);

    await conexion.query('COMMIT');
    console.log(`Piloto limpiado: se borraron ${tecnicos.rowCount} técnicos y todos los datos de los clientes piloto.`);
  } catch (error) {
    await conexion.query('ROLLBACK');
    console.error('Error al limpiar los datos del piloto:', error);
    process.exitCode = 1;
  } finally {
    conexion.release();
    await pool.end();
  }
}

limpiarPiloto();