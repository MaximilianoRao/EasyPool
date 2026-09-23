import request from 'supertest';
import app from '../index';
import { pool } from '../db';
import { crearUsuarioDePrueba, borrarUsuarioDePrueba } from './helpers';

describe('POST /login', () => {
  const email = 'test-admin@easypool.com';
  const password = 'test123';

  beforeAll(async () => {
    await crearUsuarioDePrueba(email, password, 'administrador');
  });

  afterAll(async () => {
    await borrarUsuarioDePrueba(email);
    await pool.end();
  });

  it('devuelve un token cuando el email y la contraseña son correctos', async () => {
    const respuesta = await request(app).post('/login').send({ email, password });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.token).toBeDefined();
    expect(respuesta.body.rol).toBe('administrador');
  });

  it('devuelve 401 cuando la contraseña es incorrecta', async () => {
    const respuesta = await request(app)
      .post('/login')
      .send({ email, password: 'contraseña-incorrecta' });

    expect(respuesta.status).toBe(401);
  });

  it('devuelve 401 cuando el usuario no existe', async () => {
    const respuesta = await request(app)
      .post('/login')
      .send({ email: 'no-existe@easypool.com', password: 'cualquiera' });

    expect(respuesta.status).toBe(401);
  });
});