import request from 'supertest';
import app from '../index';
import { pool } from '../db';
import {
  crearUsuarioDePrueba,
  obtenerToken,
  borrarUsuarioDePrueba,
  crearClienteConUbicacion,
  crearServicioDePrueba,
  asignarTecnicoDePrueba,
  borrarClienteCompleto,
} from './helpers';

describe('Servicios del técnico (/mis-servicios y observaciones)', () => {
  const emailAdmin = 'test-mis-servicios-admin@easypool.com';
  const emailTecnico1 = 'test-mis-servicios-tecnico1@easypool.com';
  const emailTecnico2 = 'test-mis-servicios-tecnico2@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let tokenTecnico1: string;
  let tokenTecnico2: string;
  let clienteId: number;
  let servicio: any;

  beforeAll(async () => {
    const tecnico1 = await crearUsuarioDePrueba(emailTecnico1, password, 'tecnico');
    await crearUsuarioDePrueba(emailTecnico2, password, 'tecnico');
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');

    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico1 = await obtenerToken(emailTecnico1, password);
    tokenTecnico2 = await obtenerToken(emailTecnico2, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    servicio = await crearServicioDePrueba(tokenAdmin, ubicacion.id);
    servicio = await asignarTecnicoDePrueba(tokenAdmin, servicio.id, tecnico1.id, servicio.version);
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico1);
    await borrarUsuarioDePrueba(emailTecnico2);
    await pool.end();
  });

  it('el técnico ve la dirección y los datos del cliente de su servicio', async () => {
    const respuesta = await request(app)
      .get('/mis-servicios')
      .set('Authorization', `Bearer ${tokenTecnico1}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.length).toBe(1);
    expect(respuesta.body[0].direccion).toBe('Dirección de prueba');
    expect(respuesta.body[0].cliente_nombre).toBe('Cliente de prueba');
  });

  it('otro técnico no ve servicios ajenos', async () => {
    const respuesta = await request(app)
      .get('/mis-servicios')
      .set('Authorization', `Bearer ${tokenTecnico2}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.length).toBe(0);
  });

  it('devuelve la hora del servicio tal como se cargó, sin corrimientos de zona horaria', async () => {
    const respuesta = await request(app)
      .get('/mis-servicios')
      .set('Authorization', `Bearer ${tokenTecnico1}`);

    expect(respuesta.body[0].fecha_hora).toBe('2026-10-01T10:00:00');
  });

  it('no permite registrar observaciones en un servicio pendiente (400)', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/observaciones`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ observaciones: 'Todavía no salí' });

    expect(respuesta.status).toBe(400);
  });

  it('rechaza observaciones que no sean texto (400)', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/observaciones`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ observaciones: 123 });

    expect(respuesta.status).toBe(400);
  });

  it('el técnico puede registrar observaciones una vez que salió en camino', async () => {
    await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ estado: 'en_camino', version: servicio.version });

    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/observaciones`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ observaciones: 'Se cambió el filtro de la bomba' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.observaciones).toBe('Se cambió el filtro de la bomba');
  });

  it('otro técnico no puede registrar observaciones en un servicio ajeno (404)', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/observaciones`)
      .set('Authorization', `Bearer ${tokenTecnico2}`)
      .send({ observaciones: 'Intento de escritura ajena' });

    expect(respuesta.status).toBe(404);
  });

  it('el administrador no puede usar el endpoint de observaciones (403)', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/observaciones`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ observaciones: 'Intento del admin' });

    expect(respuesta.status).toBe(403);
  });
});