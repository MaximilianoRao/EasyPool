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

describe('Transiciones de estado y bloqueo optimista', () => {
  const emailAdmin = 'test-estados-admin@easypool.com';
  const emailTecnico = 'test-estados-tecnico@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let tokenTecnico: string;
  let clienteId: number;
  let servicio: any;

  beforeAll(async () => {
    const tecnico = await crearUsuarioDePrueba(emailTecnico, password, 'tecnico');
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');

    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico = await obtenerToken(emailTecnico, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    servicio = await crearServicioDePrueba(tokenAdmin, ubicacion.id);
    servicio = await asignarTecnicoDePrueba(tokenAdmin, servicio.id, tecnico.id);
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico);
    await pool.end();
  });

  it('el técnico puede pasar de pendiente a en_camino', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ estado: 'en_camino', version: servicio.version });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.estado).toBe('en_camino');
    servicio = respuesta.body; // guardamos la version nueva para los siguientes tests
  });

  it('no permite saltar de en_camino directo a finalizado', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ estado: 'finalizado', version: servicio.version });

    expect(respuesta.status).toBe(400);
  });

  it('rechaza el cambio si la versión enviada está desactualizada', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ estado: 'en_servicio', version: servicio.version - 1 });

    expect(respuesta.status).toBe(409);
  });

  it('un técnico no puede cambiar el estado de un servicio que no es suyo', async () => {
    const emailOtro = 'test-estados-otro-tecnico@easypool.com';
    await crearUsuarioDePrueba(emailOtro, password, 'tecnico');
    const tokenOtro = await obtenerToken(emailOtro, password);

    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/estado`)
      .set('Authorization', `Bearer ${tokenOtro}`)
      .send({ estado: 'en_servicio', version: servicio.version });

    expect(respuesta.status).toBe(404);
    await borrarUsuarioDePrueba(emailOtro);
  });

  it('el administrador puede cancelar un servicio en camino', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/cancelar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ version: servicio.version, motivo: 'Prueba automatizada' });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.estado).toBe('cancelado');
    servicio = respuesta.body;
  });

  it('no se puede cancelar un servicio ya cancelado', async () => {
    const respuesta = await request(app)
      .patch(`/servicios/${servicio.id}/cancelar`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ version: servicio.version, motivo: 'Prueba automatizada' });

    expect(respuesta.status).toBe(400);
  });
});