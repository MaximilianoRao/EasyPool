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
});