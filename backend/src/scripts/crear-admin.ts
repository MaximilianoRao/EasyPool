import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';

const archivoEnv = process.argv[2] || '.env';
const email = process.argv[3] || 'admin@easypool.com';
const passwordPlano = process.argv[4] || 'admin123';

dotenv.config({ path: archivoEnv });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function crearAdmin() {
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
    ['Administrador', email, passwordHash, 'administrador']
  );

  console.log('Usuario administrador creado:', email);
  await pool.end();
}

crearAdmin();