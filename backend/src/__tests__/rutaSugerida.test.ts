import request from 'supertest';
import app from '../index';
import { pool } from '../db';
import {
  crearUsuarioDePrueba,
  obtenerToken,
  borrarUsuarioDePrueba,
  asignarTecnicoDePrueba,
  borrarClienteCompleto,
} from './helpers';

describe('Ruta sugerida (GET /rutas/sugerida)', () => {
  const emailAdmin = 'test-rutas-admin@easypool.com';
  const emailTecnico = 'test-rutas-tecnico@easypool.com';
  const password = 'test123';
  const fecha = '2026-11-02';

  let tokenAdmin: string;
  let tokenTecnico: string;
  let adminId: number;
  let tecnicoId: number;
  let clienteId: number;
  const ids: number[] = [];

  async function crearServicioEnPunto(longitud: number, fechaHora: string) {
    const ubicacionResp = await request(app)
      .post(`/clientes/${clienteId}/ubicaciones`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ direccion: `Punto ${longitud}`, latitud: 0, longitud });

    const servicioResp = await request(app)
      .post('/servicios')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ ubicacion_id: ubicacionResp.body.id, fecha_hora: fechaHora, duracion_minutos: 60 });

    await asignarTecnicoDePrueba(tokenAdmin, servicioResp.body.id, tecnicoId, servicioResp.body.version);
    return servicioResp.body.id as number;
  }

  beforeAll(async () => {
    const tecnico = await crearUsuarioDePrueba(emailTecnico, password, 'tecnico');
    const admin = await crearUsuarioDePrueba(emailAdmin, password, 'administrador');
    tecnicoId = tecnico.id;
    adminId = admin.id;

    tokenAdmin = await obtenerToken(emailAdmin, password);
    tokenTecnico = await obtenerToken(emailTecnico, password);

    const clienteResp = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Cliente de rutas' });
    clienteId = clienteResp.body.id;

    // Orden cronológico por longitud: 0, 3, 1, 2 (el mismo caso de los tests unitarios)
    ids.push(await crearServicioEnPunto(0, `${fecha}T08:00:00`));
    ids.push(await crearServicioEnPunto(3, `${fecha}T10:00:00`));
    ids.push(await crearServicioEnPunto(1, `${fecha}T12:00:00`));
    ids.push(await crearServicioEnPunto(2, `${fecha}T14:00:00`));

    // Un servicio de otro día: no tiene que aparecer
    await crearServicioEnPunto(5, '2026-11-03T08:00:00');
  });

  afterAll(async () => {
    await borrarClienteCompleto(clienteId);
    await borrarUsuarioDePrueba(emailAdmin);
    await borrarUsuarioDePrueba(emailTecnico);
    await pool.end();
  });

  it('propone un orden con menos distancia que el cronológico, solo con los servicios del día', async () => {
    const respuesta = await request(app)
      .get(`/rutas/sugerida?tecnico_id=${tecnicoId}&fecha=${fecha}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.actual.map((s: any) => s.id)).toEqual([ids[0], ids[1], ids[2], ids[3]]);
    expect(respuesta.body.sugerido.map((s: any) => s.id)).toEqual([ids[0], ids[2], ids[3], ids[1]]);
    expect(respuesta.body.distancia_actual_km).toBeCloseTo(667.2, 0);
    expect(respuesta.body.distancia_sugerida_km).toBeCloseTo(333.6, 0);
    expect(respuesta.body.ahorro_km).toBeCloseTo(333.6, 0);
  });

  it('un técnico no puede pedir la ruta sugerida (403)', async () => {
    const respuesta = await request(app)
      .get(`/rutas/sugerida?tecnico_id=${tecnicoId}&fecha=${fecha}`)
      .set('Authorization', `Bearer ${tokenTecnico}`);

    expect(respuesta.status).toBe(403);
  });

  it('rechaza el pedido si falta el técnico o la fecha (400)', async () => {
    const sinFecha = await request(app)
      .get(`/rutas/sugerida?tecnico_id=${tecnicoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    const sinTecnico = await request(app)
      .get(`/rutas/sugerida?fecha=${fecha}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(sinFecha.status).toBe(400);
    expect(sinTecnico.status).toBe(400);
  });

  it('rechaza fechas inválidas, incluso las que parecen válidas (400)', async () => {
    for (const fechaInvalida of ['mañana', '2026-13-45', '2026-02-30']) {
      const respuesta = await request(app)
        .get(`/rutas/sugerida?tecnico_id=${tecnicoId}&fecha=${fechaInvalida}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(respuesta.status).toBe(400);
    }
  });

  it('devuelve 404 si el técnico no existe', async () => {
    const respuesta = await request(app)
      .get(`/rutas/sugerida?tecnico_id=999999&fecha=${fecha}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(respuesta.status).toBe(404);
  });

  it('devuelve 400 si el usuario indicado no es técnico', async () => {
    const respuesta = await request(app)
      .get(`/rutas/sugerida?tecnico_id=${adminId}&fecha=${fecha}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(respuesta.status).toBe(400);
  });
});