import request from 'supertest';
import app from '../index';
import { pool } from '../db';
import {
  crearUsuarioDePrueba,
  obtenerToken,
  borrarUsuarioDePrueba,
  crearClienteConUbicacion,
  borrarClienteCompleto,
} from './helpers';

describe('Recurrencia de servicios (Planes de Mantenimiento)', () => {
  const emailAdmin = 'test-recurrencia-admin@easypool.com';
  const password = 'test123';

  let tokenAdmin: string;
  let clienteId: number;
  let ubicacionId: number;

  beforeAll(async () => {
    await crearUsuarioDePrueba(emailAdmin, password, 'administrador');
    tokenAdmin = await obtenerToken(emailAdmin, password);

    const { cliente, ubicacion } = await crearClienteConUbicacion(tokenAdmin);
    clienteId = cliente.id;
    ubicacionId = ubicacion.id;
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await pool.end();
  });

  it('crea un plan de mantenimiento semanal', async () => {
    const respuesta = await request(app)
      .post('/planes-mantenimiento')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ ubicacion_id: ubicacionId, frecuencia: 'semanal', fecha_inicio: '2026-10-06T09:00:00' });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.frecuencia).toBe('semanal');
  });

  it('rechaza una frecuencia inválida', async () => {
    const respuesta = await request(app)
      .post('/planes-mantenimiento')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ ubicacion_id: ubicacionId, frecuencia: 'diaria', fecha_inicio: '2026-10-06T09:00:00' });

    expect(respuesta.status).toBe(400);
  });

  it('genera servicios a partir de un plan activo', async () => {
    const generacion1 = await request(app)
      .post('/planes-mantenimiento/generar')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(generacion1.status).toBe(200);
    expect(generacion1.body.mensaje).toMatch(/Se generaron \d+ servicios/);

    const serviciosResultado = await pool.query(
      `SELECT * FROM servicio WHERE ubicacion_id = $1 AND plan_id IS NOT NULL`,
      [ubicacionId]
    );
    expect(serviciosResultado.rows.length).toBeGreaterThan(0);
  });

  it('correr la generación dos veces no crea duplicados', async () => {
    const conteoAntes = await pool.query(
      `SELECT COUNT(*) FROM servicio WHERE ubicacion_id = $1 AND plan_id IS NOT NULL`,
      [ubicacionId]
    );

    await request(app).post('/planes-mantenimiento/generar').set('Authorization', `Bearer ${tokenAdmin}`);

    const conteoDespues = await pool.query(
      `SELECT COUNT(*) FROM servicio WHERE ubicacion_id = $1 AND plan_id IS NOT NULL`,
      [ubicacionId]
    );

    expect(conteoDespues.rows[0].count).toBe(conteoAntes.rows[0].count);
  });

  it('un técnico no puede crear planes de mantenimiento (403)', async () => {
    const tecnico = await crearUsuarioDePrueba('test-recurrencia-tecnico@easypool.com', password, 'tecnico');
    const tokenTecnico = await obtenerToken('test-recurrencia-tecnico@easypool.com', password);

    const respuesta = await request(app)
      .post('/planes-mantenimiento')
      .set('Authorization', `Bearer ${tokenTecnico}`)
      .send({ ubicacion_id: ubicacionId, frecuencia: 'semanal', fecha_inicio: '2026-10-06T09:00:00' });

    expect(respuesta.status).toBe(403);
    await borrarUsuarioDePrueba('test-recurrencia-tecnico@easypool.com');
  });

  it('pausar un plan impide que se sigan generando servicios nuevos', async () => {
    const planResultado = await pool.query(
      `SELECT id FROM plan_mantenimiento WHERE ubicacion_id = $1 ORDER BY id DESC LIMIT 1`,
      [ubicacionId]
    );
    const planId = planResultado.rows[0].id;

    await request(app).patch(`/planes-mantenimiento/${planId}/pausar`).set('Authorization', `Bearer ${tokenAdmin}`);

    const conteoAntes = await pool.query(
      `SELECT COUNT(*) FROM servicio WHERE ubicacion_id = $1 AND plan_id IS NOT NULL`,
      [ubicacionId]
    );

    await request(app).post('/planes-mantenimiento/generar').set('Authorization', `Bearer ${tokenAdmin}`);

    const conteoDespues = await pool.query(
      `SELECT COUNT(*) FROM servicio WHERE ubicacion_id = $1 AND plan_id IS NOT NULL`,
      [ubicacionId]
    );

    expect(conteoDespues.rows[0].count).toBe(conteoAntes.rows[0].count);
  });
});