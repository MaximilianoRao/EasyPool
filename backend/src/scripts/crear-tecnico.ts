import bcrypt from 'bcryptjs';
import { pool } from '../db';

async function crearTecnico() {
  const email = 'tecnico@easypool.com';
  const passwordPlano = 'tecnico123';
  const passwordHash = await bcrypt.hash(passwordPlano, 10);

  await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
    ['Tecnico', email, passwordHash, 'tecnico']
  );

  console.log('Usuario tecnico creado:', email);
  await pool.end();
}

crearTecnico();