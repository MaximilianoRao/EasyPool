import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db';
import { verificarToken, verificarRol, RequestConUsuario } from './middleware/auth';
import cors from 'cors';
import { generarServiciosDesdePlanes } from './recurrencia';
import { haySuperposicion } from './agenda';
import { ordenarPorCercania, distanciaTotalKm } from './rutas';
import { crearNotificacion, notificarAdministradores, formatearFechaHora } from './notificaciones';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // permite leer el body JSON de los pedidos POST

app.get('/', (req: Request, res: Response) => {
  res.send('EasyPool backend funcionando');
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const resultado = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    res.json({ token, rol: usuario.rol });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/clientes', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar clientes:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

app.get('/clientes/:id', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al consultar cliente', error);
    res.status(500).json({ error: 'Error al consultar cliente' });
  }
});

app.get('/tecnicos', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query("SELECT id, nombre, email FROM usuario WHERE rol = 'tecnico'");
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar técnicos', error);
    res.status(500).json({ error: 'Error al consultar técnicos' });
  }
});

app.post('/clientes', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const {nombre, telefono} = req.body;
  if (!nombre) {
    res.status(400).json({ error: 'El nombre es obligatorio'});
    return;
  }
  try {
    const resultado = await pool.query('INSERT INTO cliente(nombre, telefono) VALUES ($1, $2) RETURNING *', [nombre, telefono]);
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear cliente', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

app.post('/clientes/:id/ubicaciones', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { direccion, latitud, longitud } = req.body;

  if (!direccion) {
    res.status(400).json({ error: 'La dirección es obligatoria' });
    return;
  }

  if (latitud === undefined || longitud === undefined) {
    res.status(400).json({ error: 'La latitud y la longitud son obligatorias' });
    return;
  }

  if (latitud < -90 || latitud > 90) {
    res.status(400).json({ error: 'La latitud debe estar entre -90 y 90' });
    return;
  }

  if (longitud < -180 || longitud > 180) {
    res.status(400).json({ error: 'La longitud debe estar entre -180 y 180' });
    return;
  }

  try {
    const clienteResultado = await pool.query('SELECT id FROM cliente WHERE id = $1', [id]);
    if (clienteResultado.rowCount === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    const resultado = await pool.query(`INSERT INTO ubicacion(cliente_id, direccion, latitud, longitud) VALUES ($1, $2, $3, $4) RETURNING *`, [id, direccion, latitud, longitud]);
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear ubicación', error);
    res.status(500).json({ error: 'Error al crear ubicación' });
  }
});

app.get('/clientes/:id/ubicaciones', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {

  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'SELECT * FROM ubicacion WHERE cliente_id = $1',
      [id]
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error('Error al consultar ubicaciones', error);
    res.status(500).json({ error: 'Error al consultar ubicaciones' });
  }

});

app.post('/servicios', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { ubicacion_id, fecha_hora, duracion_minutos } = req.body;

  if (!ubicacion_id || !fecha_hora || !duracion_minutos) {
    res.status(400).json({ error: 'La ubicación, la fecha y la duración son obligatorias' });
    return;
  }

  if (duracion_minutos <= 0) {
    res.status(400).json({ error: 'La duración debe ser mayor a cero' });
    return;
  }

  try {
    const ubicacionResultado = await pool.query('SELECT id FROM ubicacion WHERE id = $1', [ubicacion_id]);
    if (ubicacionResultado.rowCount === 0) {
      res.status(404).json({ error: 'Ubicación no encontrada' });
      return;
    }

    const resultado = await pool.query(
      `INSERT INTO servicio (ubicacion_id, fecha_hora, duracion_minutos) VALUES ($1, $2, $3) RETURNING *`,
      [ubicacion_id, fecha_hora, duracion_minutos]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear servicio', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

app.patch('/servicios/:id/asignar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { tecnico_id, version } = req.body;
  const adminId = req.usuario?.id;

  if (!tecnico_id) {
    res.status(400).json({ error: 'El técnico es obligatorio' });
    return;
  }

  if (version === undefined) {
    res.status(400).json({ error: 'La versión es obligatoria' });
    return;
  }

  try {
    const usuarioResultado = await pool.query('SELECT rol FROM usuario WHERE id = $1', [tecnico_id]);
    const usuario = usuarioResultado.rows[0];

    if (!usuario) {
      res.status(404).json({ error: 'El técnico indicado no existe' });
      return;
    }

    if (usuario.rol !== 'tecnico') {
      res.status(400).json({ error: 'El usuario indicado no tiene rol de técnico' });
      return;
    }

    const servicioResultado = await pool.query('SELECT * FROM servicio WHERE id = $1', [id]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }

    const estadosAsignables = ['pendiente', 'en_camino'];
    if (!estadosAsignables.includes(servicio.estado)) {
      res.status(400).json({ error: `No se puede reasignar un servicio en estado ${servicio.estado}` });
      return;
    }

    const superposicion = await haySuperposicion(tecnico_id, servicio.fecha_hora, servicio.duracion_minutos, servicio.id);
    if (superposicion) {
      res.status(409).json({ error: 'El técnico ya tiene un servicio asignado que se superpone con este horario' });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const actualizado = await client.query(
        `UPDATE servicio SET tecnico_id = $1, estado = 'pendiente', version = version + 1
         WHERE id = $2 AND version = $3 RETURNING *`,
        [tecnico_id, id, version]
      );

      if (actualizado.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'El servicio fue modificado por otra persona, actualizá la información e intentá de nuevo' });
        return;
      }

      await client.query(
        `INSERT INTO historial_estado (servicio_id, estado_anterior, estado_nuevo, actor_id, tecnico_anterior_id, tecnico_nuevo_id, motivo)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, servicio.estado, 'pendiente', adminId, servicio.tecnico_id, tecnico_id, 'Asignación de técnico']
      );

      await crearNotificacion(client, tecnico_id, Number(id), `Se te asignó un servicio para el ${formatearFechaHora(servicio.fecha_hora)}.`);
      if (servicio.tecnico_id && servicio.tecnico_id !== tecnico_id) {
        await crearNotificacion(client, servicio.tecnico_id, Number(id), `Se te quitó el servicio del ${formatearFechaHora(servicio.fecha_hora)}.`);
      }

      await client.query('COMMIT');
      res.json(actualizado.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al asignar técnico', error);
    res.status(500).json({ error: 'Error al asignar técnico' });
  }
});

app.get('/mis-servicios', verificarToken, verificarRol('tecnico'), async (req: RequestConUsuario, res: Response) => {
  const tecnicoId = req.usuario?.id;

  try {
    const resultado = await pool.query(
      `SELECT s.*, u.direccion, u.latitud, u.longitud,
              c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
       FROM servicio s
       JOIN ubicacion u ON u.id = s.ubicacion_id
       JOIN cliente c ON c.id = u.cliente_id
       WHERE s.tecnico_id = $1
       ORDER BY s.fecha_hora`,
      [tecnicoId]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar servicios del técnico', error);
    res.status(500).json({ error: 'Error al consultar servicios' });
  }
});

app.patch('/servicios/:id/estado', verificarToken, verificarRol('tecnico'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { estado, version, motivo } = req.body;
  const tecnicoId = req.usuario?.id;

  try {
    const servicioResultado = await pool.query('SELECT * FROM servicio WHERE id = $1 AND tecnico_id = $2', [id, tecnicoId]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado o no asignado al técnico' });
      return;
    }

    const transicionesValidas: Record<string, string[]> = {
      pendiente: ['en_camino'],
      en_camino: ['en_servicio', 'no_realizado'],
      en_servicio: ['finalizado', 'no_realizado'],
    };

    const permitidos = transicionesValidas[servicio.estado] || [];
    if (!permitidos.includes(estado)) {
      res.status(400).json({ error: `No se puede pasar de ${servicio.estado} a ${estado}` });
      return;
    }

    if (estado === 'no_realizado' && !motivo) {
      res.status(400).json({ error: 'El motivo es obligatorio para marcar un servicio como no realizado' });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const actualizado = await client.query(
        `UPDATE servicio SET estado = $1, motivo_no_realizado = $2, version = version + 1 WHERE id = $3 AND version = $4 RETURNING *`,
        [estado, estado === 'no_realizado' ? motivo : null, id, version]
      );

      if (actualizado.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'El servicio fue modificado por otra persona, actualizá la información e intentá de nuevo' });
        return;
      }

      await client.query(
        `INSERT INTO historial_estado (servicio_id, estado_anterior, estado_nuevo, actor_id, motivo) VALUES ($1, $2, $3, $4, $5)`,
        [id, servicio.estado, estado, tecnicoId, estado === 'no_realizado' ? motivo : null]
      );

      if (estado === 'no_realizado') {
        await notificarAdministradores(
          client,
          Number(id),
          `El servicio del ${formatearFechaHora(servicio.fecha_hora)} quedó como no realizado: ${motivo}.`
        );
      }

      await client.query('COMMIT');
      res.json(actualizado.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al cambiar estado', error);
    res.status(500).json({ error: 'Error al cambiar estado del servicio' });
  }
});


app.patch('/servicios/:id/cancelar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { version, motivo } = req.body;
  const adminId = req.usuario?.id;

  try {
    const servicioResultado = await pool.query('SELECT * FROM servicio WHERE id = $1', [id]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }

    const estadosCancelables = ['pendiente', 'en_camino', 'no_realizado'];
    if (!estadosCancelables.includes(servicio.estado)) {
      res.status(400).json({ error: `No se puede cancelar un servicio en estado ${servicio.estado}` });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const actualizado = await client.query(
        `UPDATE servicio SET estado = 'cancelado', version = version + 1 WHERE id = $1 AND version = $2 RETURNING *`,
        [id, version]
      );

      if (actualizado.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'El servicio fue modificado por otra persona, actualizá la información e intentá de nuevo' });
        return;
      }

      await client.query(
        `INSERT INTO historial_estado (servicio_id, estado_anterior, estado_nuevo, actor_id, motivo) VALUES ($1, $2, $3, $4, $5)`,
        [id, servicio.estado, 'cancelado', adminId, motivo || null]
      );

      if (servicio.tecnico_id) {
        await crearNotificacion(client, servicio.tecnico_id, Number(id), `El servicio del ${formatearFechaHora(servicio.fecha_hora)} fue cancelado.`);
      }

      await client.query('COMMIT');
      res.json(actualizado.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al cancelar servicio', error);
    res.status(500).json({ error: 'Error al cancelar el servicio' });
  }
});

app.patch('/servicios/:id/reprogramar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { version, fecha_hora } = req.body;
  const adminId = req.usuario?.id;

  if (!fecha_hora) {
    res.status(400).json({ error: 'La nueva fecha y hora son obligatorias' });
    return;
  }

  try {
    const servicioResultado = await pool.query('SELECT * FROM servicio WHERE id = $1', [id]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }

    const estadosReprogramables = ['pendiente', 'en_camino', 'no_realizado'];
    if (!estadosReprogramables.includes(servicio.estado)) {
      res.status(400).json({ error: `No se puede reprogramar un servicio en estado ${servicio.estado}` });
      return;
    }

    if (servicio.tecnico_id) {
      const superposicion = await haySuperposicion(servicio.tecnico_id, fecha_hora, servicio.duracion_minutos, servicio.id);
      if (superposicion) {
        res.status(409).json({ error: 'La nueva fecha se superpone con otro servicio del técnico asignado' });
        return;
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const actualizado = await client.query(
        `UPDATE servicio SET estado = 'pendiente', fecha_hora = $1, version = version + 1 WHERE id = $2 AND version = $3 RETURNING *`,
        [fecha_hora, id, version]
      );

      if (actualizado.rowCount === 0) {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'El servicio fue modificado por otra persona, actualizá la información e intentá de nuevo' });
        return;
      }

      await client.query(
        `INSERT INTO historial_estado (servicio_id, estado_anterior, estado_nuevo, actor_id, motivo, fecha_anterior, fecha_nueva)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, servicio.estado, 'pendiente', adminId, 'Reprogramación', servicio.fecha_hora, fecha_hora]
      );

      if (servicio.tecnico_id) {
        await crearNotificacion(
          client,
          servicio.tecnico_id,
          Number(id),
          `El servicio del ${formatearFechaHora(servicio.fecha_hora)} fue reprogramado para el ${formatearFechaHora(fecha_hora)}.`
        );
      }

      await client.query('COMMIT');
      res.json(actualizado.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al reprogramar servicio', error);
    res.status(500).json({ error: 'Error al reprogramar el servicio' });
  }
});

app.get('/servicios', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query(
      `SELECT s.*, u.direccion, c.nombre AS cliente_nombre, t.email AS tecnico_email
       FROM servicio s
       JOIN ubicacion u ON u.id = s.ubicacion_id
       JOIN cliente c ON c.id = u.cliente_id
       LEFT JOIN usuario t ON t.id = s.tecnico_id
       ORDER BY s.fecha_hora`
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar servicios', error);
    res.status(500).json({ error: 'Error al consultar servicios' });
  }
});

app.post('/planes-mantenimiento', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { ubicacion_id, frecuencia, fecha_inicio, duracion_minutos } = req.body;

  if (!ubicacion_id || !frecuencia || !fecha_inicio || !duracion_minutos) {
    res.status(400).json({ error: 'ubicacion_id, frecuencia, fecha_inicio y duracion_minutos son obligatorios' });
    return;
  }

  if (!['semanal', 'quincenal', 'mensual'].includes(frecuencia)) {
    res.status(400).json({ error: 'frecuencia debe ser semanal, quincenal o mensual' });
    return;
  }

  if (duracion_minutos <= 0) {
    res.status(400).json({ error: 'La duración debe ser mayor a cero' });
    return;
  }

  try {
    const ubicacionResultado = await pool.query('SELECT id FROM ubicacion WHERE id = $1', [ubicacion_id]);
    if (ubicacionResultado.rowCount === 0) {
      res.status(404).json({ error: 'Ubicación no encontrada' });
      return;
    }

    const resultado = await pool.query(
      `INSERT INTO plan_mantenimiento (ubicacion_id, frecuencia, fecha_inicio, proxima_generacion, duracion_minutos, activo)
       VALUES ($1, $2, $3, $3, $4, true) RETURNING *`,
      [ubicacion_id, frecuencia, fecha_inicio, duracion_minutos]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear plan de mantenimiento', error);
    res.status(500).json({ error: 'Error al crear el plan de mantenimiento' });
  }
});

app.get('/planes-mantenimiento', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query(
      `SELECT p.*, u.direccion, c.nombre AS cliente_nombre
       FROM plan_mantenimiento p
       JOIN ubicacion u ON u.id = p.ubicacion_id
       JOIN cliente c ON c.id = u.cliente_id
       ORDER BY p.fecha_inicio`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar planes de mantenimiento', error);
    res.status(500).json({ error: 'Error al consultar planes de mantenimiento' });
  }
});

app.patch('/planes-mantenimiento/:id/pausar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('UPDATE plan_mantenimiento SET activo = false WHERE id = $1 RETURNING *', [id]);
    if (resultado.rowCount === 0) {
      res.status(404).json({ error: 'Plan no encontrado' });
      return;
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al pausar plan', error);
    res.status(500).json({ error: 'Error al pausar el plan' });
  }
});

app.patch('/planes-mantenimiento/:id/reactivar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('UPDATE plan_mantenimiento SET activo = true WHERE id = $1 RETURNING *', [id]);
    if (resultado.rowCount === 0) {
      res.status(404).json({ error: 'Plan no encontrado' });
      return;
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al reactivar plan', error);
    res.status(500).json({ error: 'Error al reactivar el plan' });
  }
});

app.post('/planes-mantenimiento/generar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  try {
    const totalGenerados = await generarServiciosDesdePlanes();
    res.json({ mensaje: `Se generaron ${totalGenerados} servicios nuevos.` });
  } catch (error) {
    console.error('Error al generar servicios recurrentes', error);
    res.status(500).json({ error: 'Error al generar servicios recurrentes' });
  }
});


app.patch('/servicios/:id/observaciones', verificarToken, verificarRol('tecnico'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { observaciones } = req.body;
  const tecnicoId = req.usuario?.id;

  if (typeof observaciones !== 'string') {
    res.status(400).json({ error: 'Las observaciones deben ser un texto' });
    return;
  }

  try {
    const servicioResultado = await pool.query('SELECT estado FROM servicio WHERE id = $1 AND tecnico_id = $2', [id, tecnicoId]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado o no asignado al técnico' });
      return;
    }

    if (servicio.estado === 'pendiente' || servicio.estado === 'cancelado') {
      res.status(400).json({ error: `No se pueden registrar observaciones en un servicio en estado ${servicio.estado}` });
      return;
    }

    const resultado = await pool.query('UPDATE servicio SET observaciones = $1 WHERE id = $2 RETURNING *', [observaciones, id]);
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al guardar observaciones', error);
    res.status(500).json({ error: 'Error al guardar las observaciones' });
  }
});

function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === fecha;
}

const redondearKm = (km: number) => Math.round(km * 10) / 10;

app.get('/rutas/sugerida', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const tecnicoId = Number(req.query.tecnico_id);
  const fecha = String(req.query.fecha ?? '');

  if (!Number.isInteger(tecnicoId) || !esFechaValida(fecha)) {
    res.status(400).json({ error: 'Se requiere tecnico_id y una fecha válida con formato AAAA-MM-DD' });
    return;
  }

  try {
    const tecnicoResultado = await pool.query('SELECT rol FROM usuario WHERE id = $1', [tecnicoId]);
    const tecnico = tecnicoResultado.rows[0];

    if (!tecnico) {
      res.status(404).json({ error: 'El técnico indicado no existe' });
      return;
    }

    if (tecnico.rol !== 'tecnico') {
      res.status(400).json({ error: 'El usuario indicado no tiene rol de técnico' });
      return;
    }

    const serviciosResultado = await pool.query(
      `SELECT s.id, s.fecha_hora, s.duracion_minutos, s.estado,
              u.direccion, u.latitud, u.longitud, c.nombre AS cliente_nombre
       FROM servicio s
       JOIN ubicacion u ON u.id = s.ubicacion_id
       JOIN cliente c ON c.id = u.cliente_id
       WHERE s.tecnico_id = $1
         AND s.fecha_hora::date = $2::date
         AND s.estado IN ('pendiente', 'en_camino', 'en_servicio')
       ORDER BY s.fecha_hora`,
      [tecnicoId, fecha]
    );
    const servicios = serviciosResultado.rows;

    const puntos = servicios.map((s) => ({ id: s.id, latitud: s.latitud, longitud: s.longitud }));
    const puntosSugeridos = ordenarPorCercania(puntos);
    const sugerido = puntosSugeridos.map((p) => servicios.find((s) => s.id === p.id));

    const distanciaActual = distanciaTotalKm(puntos);
    const distanciaSugerida = distanciaTotalKm(puntosSugeridos);

    res.json({
      actual: servicios,
      sugerido,
      distancia_actual_km: redondearKm(distanciaActual),
      distancia_sugerida_km: redondearKm(distanciaSugerida),
      ahorro_km: redondearKm(distanciaActual - distanciaSugerida),
    });
  } catch (error) {
    console.error('Error al calcular la ruta sugerida', error);
    res.status(500).json({ error: 'Error al calcular la ruta sugerida' });
  }
});

app.get('/notificaciones', verificarToken, async (req: RequestConUsuario, res: Response) => {
  const usuarioId = req.usuario?.id;

  try {
    const resultado = await pool.query(
      `SELECT id, servicio_id, mensaje, leida, creada_en
       FROM notificacion
       WHERE usuario_id = $1
       ORDER BY creada_en DESC
       LIMIT 50`,
      [usuarioId]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar notificaciones', error);
    res.status(500).json({ error: 'Error al consultar notificaciones' });
  }
});

app.patch('/notificaciones/leidas', verificarToken, async (req: RequestConUsuario, res: Response) => {
  const usuarioId = req.usuario?.id;

  try {
    await pool.query('UPDATE notificacion SET leida = true WHERE usuario_id = $1 AND leida = false', [usuarioId]);
    res.json({ mensaje: 'Notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar notificaciones', error);
    res.status(500).json({ error: 'Error al marcar las notificaciones' });
  }
});

app.patch('/notificaciones/:id/leida', verificarToken, async (req: RequestConUsuario, res: Response) => {
  const id = Number(req.params.id);
  const usuarioId = req.usuario?.id;

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'El id de la notificación no es válido' });
    return;
  }

  try {
    const resultado = await pool.query(
      'UPDATE notificacion SET leida = true WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuarioId]
    );

    if (resultado.rowCount === 0) {
      res.status(404).json({ error: 'Notificación no encontrada' });
      return;
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al marcar notificación', error);
    res.status(500).json({ error: 'Error al marcar la notificación' });
  }
});

export default app;
if (require.main === module) {
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
}