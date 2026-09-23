import bcrypt from 'bcryptjs';
import request from 'supertest';
import app from '../index';
import { pool } from '../db';

export async function crearUsuarioDePrueba(email: string, password: string, rol: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const resultado = await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING *',
    [`Usuario de prueba (${rol})`, email, passwordHash, rol]
  );
  return resultado.rows[0];
}

export async function obtenerToken(email: string, password: string): Promise<string> {
  const respuesta = await request(app).post('/login').send({ email, password });
  return respuesta.body.token;
}

export async function borrarUsuarioDePrueba(email: string) {
  await pool.query('DELETE FROM usuario WHERE email = $1', [email]);
}


export async function crearClienteConUbicacion(tokenAdmin: string) {
  const clienteResp = await request(app)
    .post('/clientes')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ nombre: 'Cliente de prueba' });

  const ubicacionResp = await request(app)
    .post(`/clientes/${clienteResp.body.id}/ubicaciones`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ direccion: 'Dirección de prueba', latitud: -31.4, longitud: -64.18 });

  return { cliente: clienteResp.body, ubicacion: ubicacionResp.body };
}

export async function crearServicioDePrueba(tokenAdmin: string, ubicacionId: number) {
  const respuesta = await request(app)
    .post('/servicios')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ ubicacion_id: ubicacionId, fecha_hora: '2026-10-01T10:00:00' });
  return respuesta.body;
}

export async function asignarTecnicoDePrueba(tokenAdmin: string, servicioId: number, tecnicoId: number) {
  const respuesta = await request(app)
    .patch(`/servicios/${servicioId}/asignar`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ tecnico_id: tecnicoId });
  return respuesta.body;
}

export async function borrarClienteCompleto(clienteId: number) {
  await pool.query(
    `DELETE FROM historial_estado WHERE servicio_id IN
      (SELECT id FROM servicio WHERE ubicacion_id IN (SELECT id FROM ubicacion WHERE cliente_id = $1))`,
    [clienteId]
  );
  await pool.query(
    'DELETE FROM servicio WHERE ubicacion_id IN (SELECT id FROM ubicacion WHERE cliente_id = $1)',
    [clienteId]
  );
  await pool.query('DELETE FROM ubicacion WHERE cliente_id = $1', [clienteId]);
  await pool.query('DELETE FROM cliente WHERE id = $1', [clienteId]);
}