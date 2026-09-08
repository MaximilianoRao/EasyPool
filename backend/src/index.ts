import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db';
import { verificarToken, RequestConUsuario } from './middleware/auth';
import cors from 'cors';

const app = express();
const PORT = 3000;

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

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/clientes', verificarToken, async (req: RequestConUsuario, res: Response) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar clientes:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});