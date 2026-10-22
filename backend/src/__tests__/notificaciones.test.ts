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

describe('Notificaciones', () => {
  const emailAdmin = 'test-notif-admin@easypool.com';
  const emailTecnico1 = 'test-notif-tecnico1@easypool.com';
  const emailTecnico2 = 'test-notif-tecnico2@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let tokenTecnico1: string;
  let tokenTecnico2: string;
  let tecnico1Id: number;
  let tecnico2Id: number;
  let clienteId: number;
  let ubicacionId: number;
  let servicio: any;

  async function notificacionesDe(token: string): Promise<any[]> {
    const respuesta = await request(app).get('/notificaciones').set('Authorization', `Bearer ${token}`);
    return respuesta.body;
  }

  beforeAll(async () => {
    const tecnico1 = await crearUsuarioDePrueba(emailTecnico1, password, 'tecnico');
    const tecnico2 = await crearUsuarioDePrueba(emailTecnico2, password, 'tecnico');
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');
    tecnico1Id = tecnico1.id;
    tecnico2Id = tecnico2.id;

    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico1 = await obtenerToken(emailTecnico1, password);
    tokenTecnico2 = await obtenerToken(emailTecnico2, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    ubicacionId = ubicacion.id;
    servicio = await crearServicioDePrueba(tokenAdmin, ubicacionId);
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico1);
    await borrarUsuarioDePrueba(emailTecnico2);
    await pool.end();
  });

  it('al asignar un servicio, el técnico recibe una notificación sin leer', async () => {
    servicio = await asignarTecnicoDePrueba(tokenAdmin, servicio.id, tecnico1Id, servicio.version);

    const lista = await notificacionesDe(tokenTecnico1);

    expect(lista.length).toBe(1);
    expect(lista[0].mensaje).toMatch(/Se te asignó/);
    expect(lista[0].servicio_id).toBe(servicio.id);
    expect(lista[0].leida).toBe(false);
  });

  it('al reasignar, se avisa al técnico anterior y al nuevo', async () => {
    servicio = await asignarTecnicoDePrueba(tokenAdmin, servicio.id, tecnico2Id, servicio.version);

    const tecnico1 = await notificacionesDe(tokenTecnico1);
    const tecnico2 = await notificacionesDe(tokenTecnico2);

    expect(tecnico1.some((n) => /Se te quitó/.test(n.mensaje))).toBe(true);
    expect(tecnico2.some((n) => /Se te asignó/.test(n.mensaje))).toBe(true);
  });

  it('una operación rechazada por conflicto de versión no genera notificaciones', async () => {
    const antes = (await notificacionesDe(tokenTecnico2)).length;

    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/asignar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ tecnico_id: tecnico1Id, version: servicio.version - 1 });

    expect(respuesta.status).toBe(409);
    expect((await notificacionesDe(tokenTecnico2)).length).toBe(antes);
  });

  it('al reprogramar, el técnico asignado recibe la notificación', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/reprogramar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ version: servicio.version, fecha_hora: '2026-12-01T10:00:00' });

    expect(respuesta.status).toBe(200);
    servicio = respuesta.body;

    const lista = await notificacionesDe(tokenTecnico2);
    expect(lista.some((n) => /reprogramado/.test(n.mensaje))).toBe(true);
  });

  it('al cancelar, el técnico asignado recibe la notificación', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/cancelar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ version: servicio.version, motivo: 'Prueba automatizada' });

    expect(respuesta.status).toBe(200);

    const lista = await notificacionesDe(tokenTecnico2);
    expect(lista.some((n) => /cancelado/.test(n.mensaje))).toBe(true);
  });

  it('cuando el técnico marca no realizado, el administrador recibe el aviso con el motivo', async () => {
    let servicio2 = await crearServicioDePrueba(tokenAdmin, ubicacionId);
    servicio2 = await asignarTecnicoDePrueba(tokenAdmin, servicio2.id, tecnico1Id, servicio2.version);

    const enCamino = await request(app)
      .patch(`/servicios/${servicio2.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ estado: 'en_camino', version: servicio2.version });

    await request(app)
      .patch(`/servicios/${servicio2.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico1}`)
      .send({ estado: 'no_realizado', motivo: 'Cliente ausente', version: enCamino.body.version });

    const lista = await notificacionesDe(tokenAdmin);
    expect(lista.some((n) => /no realizado/.test(n.mensaje) && /Cliente ausente/.test(n.mensaje))).toBe(true);
  });

  it('un técnico no puede marcar como leída una notificación ajena (404)', async () => {
    const delOtro = await notificacionesDe(tokenTecnico2);

    const respuesta = await request(app)
      .patch(`/notificaciones/${delOtro[0].id}/leida`)
      .set('Authorization', `Bearer ${tokenTecnico1}`);

    expect(respuesta.status).toBe(404);
  });

  it('rechaza un id de notificación inválido (400)', async () => {
    const respuesta = await request(app)
      .patch('/notificaciones/abc/leida')
      .set('Authorization', `Bearer ${tokenTecnico1}`);

    expect(respuesta.status).toBe(400);
  });

  it('el usuario puede marcar una notificación propia como leída', async () => {
    const propias = await notificacionesDe(tokenTecnico2);

    const respuesta = await request(app)
      .patch(`/notificaciones/${propias[0].id}/leida`)
      .set('Authorization', `Bearer ${tokenTecnico2}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.leida).toBe(true);
  });

  it('el usuario puede marcar todas sus notificaciones como leídas', async () => {
    await request(app).patch('/notificaciones/leidas').set('Authorization', `Bearer ${tokenTecnico2}`);

    const lista = await notificacionesDe(tokenTecnico2);
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((n) => n.leida)).toBe(true);
  });
});