import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';

const archivoEnv = process.argv[2] || '.env';
const email = process.argv[3] || 'tecnico@easypool.com';
const passwordPlano = process.argv[4] || 'tecnico123';

dotenv.config({ path: archivoEnv });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

async function crearTecnico() {
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
    ['Tecnico', email, passwordHash, 'tecnico']
  );

  console.log('Usuario tecnico creado:', email);
  await pool.end();
}

crearTecnico();