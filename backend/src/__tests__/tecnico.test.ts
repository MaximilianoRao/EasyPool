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

describe('Servicios del técnico (/mis-servicios)', () => {
  const emailAdmin = 'test-mis-servicios-admin@easypool.com';
  const emailTecnico1 = 'test-mis-servicios-tecnico1@easypool.com';
  const emailTecnico2 = 'test-mis-servicios-tecnico2@easypool.com';
  const password = 'test123';

  let tokenTecnico1: string;
  let tokenTecnico2: string;
  let clienteId: number;

  beforeAll(async () => {
    const tecnico1 = await crearUsuarioDePrueba(emailTecnico1, password, 'tecnico');
    await crearUsuarioDePrueba(emailTecnico2, password, 'tecnico');
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');

    const tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico1 = await obtenerToken(emailTecnico1, password);
    tokenTecnico2 = await obtenerToken(emailTecnico2, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    const servicio = await crearServicioDePrueba(tokenAdmin, ubicacion.id);
    await asignarTecnicoDePrueba(tokenAdmin, servicio.id, tecnico1.id, servicio.version);
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
});