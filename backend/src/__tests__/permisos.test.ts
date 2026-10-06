import request from 'supertest';
import app from '../index';
import { crearUsuarioDePrueba, obtenerToken, borrarUsuarioDePrueba } from './helpers';
import { pool } from '../db';

describe('Permisos por rol', () => {
  const emailAdmin = 'test-permisos-admin@easypool.com';
  const emailTecnico = 'test-permisos-tecnico@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let tokenTecnico: string;

  beforeAll(async () => {
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');
    await crearUsuarioDePrueba(emailTecnico, password, 'tecnico');
    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico = await obtenerToken(emailTecnico, password);
  });

  afterAll(async () => {
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico);
    await pool.end();
  });

  it('un técnico NO puede crear un cliente (403)', async () => {
    const respuesta = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ nombre: 'Cliente de prueba' });

    expect(respuesta.status).toBe(403);
  });

  it('un administrador SÍ puede crear un cliente', async () => {
    const respuesta = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Cliente de prueba' });

    expect(respuesta.status).toBe(201);

    // limpieza: este test crea un dato real en la base, lo borramos al toque
    await pool.query('DELETE FROM cliente WHERE id = $1', [respuesta.body.id]);
  });

  it('un administrador NO puede acceder a /mis-servicios (403)', async () => {
    const respuesta = await request(app)
      .get('/mis-servicios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(respuesta.status).toBe(403);
  });

  it('sin token, devuelve 401', async () => {
    const respuesta = await request(app).get('/clientes');
    expect(respuesta.status).toBe(401);
  });

  it('un técnico no puede listar todos los servicios (403)', async () => {
    const respuesta = await request(app)
      .get('/servicios')
      .set('Authorization', `Bearer ${tokenTecnico}`);

    expect(respuesta.status).toBe(403);
  });

  it('un técnico no puede consultar un cliente por id (403)', async () => {
    const respuesta = await request(app)
      .get('/clientes/1')
      .set('Authorization', `Bearer ${tokenTecnico}`);

    expect(respuesta.status).toBe(403);
  });

    it('rechaza crear una ubicación con latitud fuera de rango', async () => {
    const clienteResp = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Cliente validación' });

    const respuesta = await request(app)
      .post(`/clientes/${clienteResp.body.id}/ubicaciones`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ direccion: 'Calle falsa 123', latitud: 200, longitud: -64 });

    expect(respuesta.status).toBe(400);
    await pool.query('DELETE FROM cliente WHERE id = $1', [clienteResp.body.id]);
  });

  it('devuelve 404 al consultar un cliente que no existe', async () => {
    const respuesta = await request(app)
      .get('/clientes/999999')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(respuesta.status).toBe(404);
  });

  it('devuelve 404 al crear un servicio con una ubicación inexistente', async () => {
    const respuesta = await request(app)
      .post('/servicios')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ ubicacion_id: 999999, fecha_hora: '2026-10-25T10:00:00', duracion_minutos: 60 });

    expect(respuesta.status).toBe(404);
  });

});