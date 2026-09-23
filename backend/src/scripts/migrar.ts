import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';

const archivoEnv = process.argv[2] || '.env';
dotenv.config({ path: archivoEnv });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrar() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      nombre_archivo VARCHAR(255) UNIQUE NOT NULL,
      aplicado_en TIMESTAMP NOT NULL DEFAULT now()
    );
  `);

  const carpetaMigraciones = path.join(__dirname, '../../../db/migrations');
  const archivos = fs.readdirSync(carpetaMigraciones).filter((f) => f.endsWith('.sql')).sort();

  const yaAplicadasResultado = await pool.query('SELECT nombre_archivo FROM schema_migrations');
  const yaAplicadas = new Set(yaAplicadasResultado.rows.map((r) => r.nombre_archivo));

  for (const archivo of archivos) {
    if (yaAplicadas.has(archivo)) {
      console.log(`Ya aplicada: ${archivo}`);
      continue;
    }

    console.log(`Aplicando: ${archivo}...`);
    const sql = fs.readFileSync(path.join(carpetaMigraciones, archivo), 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (nombre_archivo) VALUES ($1)', [archivo]);
      await client.query('COMMIT');
      console.log(`Aplicada correctamente: ${archivo}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Error aplicando ${archivo}:`, error);
      process.exit(1);
    } finally {
      client.release();
    }
  }

  await pool.end();
  console.log('Base de datos al día.');
}

migrar();