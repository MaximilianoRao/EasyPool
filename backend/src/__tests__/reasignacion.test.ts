import request from 'supertest';
import app from '../index';
import { pool } from '../db';
import {
  crearUsuarioDePrueba,
  obtenerToken,
  borrarUsuarioDePrueba,
  crearClienteConUbicacion,
  crearServicioDePrueba,
  borrarClienteCompleto,
} from './helpers';

describe('Asignación y reasignación de técnicos', () => {
  const emailAdmin = 'test-reasig-admin@easypool.com';
  const emailTecnico1 = 'test-reasig-tecnico1@easypool.com';
  const emailTecnico2 = 'test-reasig-tecnico2@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let tokenTecnico1: string;
  let tecnico1Id: number;
  let tecnico2Id: number;
  let clienteId: number;
  let servicio: any;

  beforeAll(async () => {
    const tecnico1 = await crearUsuarioDePrueba(emailTecnico1, password, 'tecnico');
    const tecnico2 = await crearUsuarioDePrueba(emailTecnico2, password, 'tecnico');
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');

    tecnico1Id = tecnico1.id;
    tecnico2Id = tecnico2.id;
    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico1 = await obtenerToken(emailTecnico1, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    servicio = await crearServicioDePrueba(tokenAdmin, ubicacion.id);
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico1);
    await borrarUsuarioDePrueba(emailTecnico2);
    await pool.end();
  });

  it('un técnico no puede asignar servicios (403)', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ tecnico_id: tecnico1Id });

    expect(respuesta.status).toBe(403);
  });

  it('no permite asignar un id de usuario que no existe', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ tecnico_id: 999999 });

    expect(respuesta.status).toBe(404);
  });

  it('no permite asignar un usuario que no tiene rol técnico', async () => {
    const adminResultado = await pool.query('SELECT id FROM usuario WHERE email = $1', [emailAdmin]);
    const adminId = adminResultado.rows[0].id;

    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ tecnico_id: adminId });

    expect(respuesta.status).toBe(400);
  });

  it('el administrador asigna correctamente un técnico', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ tecnico_id: tecnico1Id });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.tecnico_id).toBe(tecnico1Id);
  });

  it('el administrador puede reasignar el servicio a otro técnico', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ tecnico_id: tecnico2Id });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.tecnico_id).toBe(tecnico2Id);
  });

  it('el técnico 1 ya no puede operar el servicio después de la reasignación', async () => {
    const servicioActual = (await pool.query('SELECT * FROM servicio WHERE id = $1', [servicio.id])).rows[0];

    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ estado: 'en_camino', version: servicioActual.version });

    expect(respuesta.status).toBe(404);
  });
});