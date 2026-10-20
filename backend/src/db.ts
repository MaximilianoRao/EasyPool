import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

types.setTypeParser(1114, (valor: string) => valor.replace(' ', 'T'));

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});