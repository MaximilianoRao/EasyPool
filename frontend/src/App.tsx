import { useState, useEffect } from 'react';
import { login, obtenerClientes, obtenerServicios} from './api';
import AdminPanel from './AdminPanel';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [rol, setRol] = useState<string | null>(localStorage.getItem('rol'));
  const [clientes, setClientes] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
    cargarClientes(token);
    cargarServicios(token);
    }
  }, [token]);

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  try {
    const { token: tokenObtenido, rol: rolObtenido } = await login(email, password);
    setToken(tokenObtenido);
    setRol(rolObtenido);
    localStorage.setItem('token', tokenObtenido);
    localStorage.setItem('rol', rolObtenido);
    await cargarClientes(tokenObtenido);
    await cargarServicios(tokenObtenido);
  } catch (err) {
    setError('No se pudo iniciar sesión. Revisá el email y la contraseña.');
  }
}

  async function cargarClientes(tokenActual: string) {
  try {
    const listaClientes = await obtenerClientes(tokenActual);
    setClientes(listaClientes);
  } catch (err) {
    console.error('Error al cargar clientes:', err);
  }
  }


  async function cargarServicios(tokenActual: string) {
    try {
      const listaServicios = await obtenerServicios(tokenActual);
      setServicios(listaServicios);
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    }
  }

  function handleLogout() {
    setToken(null);
    setRol(null);
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setEmail('');
    setPassword('');
  }

  if (token) {
    return (
      <div>
        <h1>EasyPool</h1>
        <p>Sesión iniciada correctamente.</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
        {rol === 'administrador' && (
          <AdminPanel
            token={token}
            clientes={clientes}
            onClienteCreado={() => cargarClientes(token)}
            onServicioCreado={() => cargarServicios(token)}
          />
        )}
        {rol === 'tecnico' && (
          <p>Vista del técnico — la armamos en la próxima rama.</p>
        )}
        <h2>Clientes</h2>
        {clientes.length === 0 ? (
          <p>No hay clientes cargados todavía.</p>
        ) : (
          <ul>
            {clientes.map((c) => (
              <li key={c.id}>{c.nombre}</li>
            ))}
          </ul>
        )}
        <h2>Servicios</h2>
        {servicios.length === 0 ? (
        <p>No hay servicios cargados todavía.</p>
        ) : (
        <ul>
          {servicios.map((s) => (
          <li key={s.id}>
            {s.fecha_hora} — estado: {s.estado} {s.tecnico_id ? `— técnico #${s.tecnico_id}` : '(sin asignar)'}
          </li>
          ))}
        </ul>
)}

      </div>
    );
  }

  return (
    <div>
      <h1>EasyPool - Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;