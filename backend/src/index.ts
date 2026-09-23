import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db';
import { verificarToken, verificarRol, RequestConUsuario } from './middleware/auth';
import cors from 'cors';

const app = express();
const PORT = 3001;

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

app.get('/clientes/:id', verificarToken, async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);

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

  try {
    const resultado = await pool.query(`INSERT INTO ubicacion(cliente_id, direccion, latitud, longitud) VALUES ($1, $2, $3, $4) RETURNING *`, [id, direccion, latitud, longitud]);
    res.status(201).json(resultado.rows[0]);
    
  } catch (error) {
    console.error('Error al crear ubicación', error);
    res.status(500).json({ error: 'Error al crear ubicación' });
  }

});

app.get('/clientes/:id/ubicaciones', verificarToken, async (req: RequestConUsuario, res: Response) => {

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

  const { ubicacion_id, fecha_hora } = req.body;

  if (!ubicacion_id || !fecha_hora) {
    res.status(400).json({ error: 'La ubicación y la fecha son obligatorias' });
    return;
  }

  try {
    const resultado = await pool.query(`INSERT INTO servicio (ubicacion_id, fecha_hora) VALUES ($1, $2) RETURNING *`, [ubicacion_id, fecha_hora]);
    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error('Error al crear servicio', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }

});

app.patch('/servicios/:id/asignar', verificarToken, verificarRol('administrador'), async (req: RequestConUsuario, res: Response) => {
  const { id } = req.params;
  const { tecnico_id } = req.body;

  if (!tecnico_id) {
    res.status(400).json({ error: 'El técnico es obligatorio' });
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
    const resultado = await pool.query(`UPDATE servicio SET tecnico_id = $1 WHERE id = $2 RETURNING *`, [tecnico_id, id]);
    res.json(resultado.rows[0]);

  } catch (error) {
    console.error('Error al asignar técnico', error);
    res.status(500).json({ error: 'Error al asignar técnico' });
  }
});

app.get('/mis-servicios', verificarToken, verificarRol('tecnico'), async (req: RequestConUsuario, res: Response) => {

  const tecnicoId = req.usuario?.id;

  try {
    const resultado = await pool.query(
      'SELECT * FROM servicio WHERE tecnico_id = $1',
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
  const { estado, version } = req.body;
  const tecnicoId = req.usuario?.id;

  try {
    const servicioResultado = await pool.query('SELECT * FROM servicio WHERE id = $1 AND tecnico_id = $2', [id, tecnicoId]);
    const servicio = servicioResultado.rows[0];

    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado o no asignado al técnico' });
      return;
    }

    if (servicio.version !== version) {
      res.status(409).json({ error: 'El servicio fue modificado por otra persona, actualizá la información e intentá de nuevo' });
      return;
    }

    const transicionesValidas: Record<string, string[]> = {
      pendiente: ['en_camino'],
      en_camino: ['en_servicio'],
      en_servicio: ['finalizado'],
    };

    const permitidos = transicionesValidas[servicio.estado] || [];
    if (!permitidos.includes(estado)) {
      res.status(400).json({ error: `No se puede pasar de ${servicio.estado} a ${estado}` });
      return;
    }

    const resultado = await pool.query(
      `UPDATE servicio SET estado = $1, version = version + 1 WHERE id = $2 AND version = $3 RETURNING *`,
      [estado, id, version]
    );

    await pool.query(
      `INSERT INTO historial_estado (servicio_id, estado_anterior, estado_nuevo, actor_id) VALUES ($1, $2, $3, $4)`,
      [id, servicio.estado, estado, tecnicoId]
    );

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al cambiar estado', error);
    res.status(500).json({ error: 'Error al cambiar estado del servicio' });
  }
});

app.get('/servicios', verificarToken, async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM servicio ORDER BY fecha_hora'
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error('Error al consultar servicios', error);
    res.status(500).json({ error: 'Error al consultar servicios' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});