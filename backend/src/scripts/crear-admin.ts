import bcrypt from 'bcryptjs';
import { pool } from '../db';

async function crearAdmin() {
  const email = 'admin@easypool.com';
  const passwordPlano = 'admin123';
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
    ['Administrador', email, passwordHash, 'administrador']
  );

  console.log('Usuario administrador creado:', email);
  await pool.end();
}

crearAdmin();