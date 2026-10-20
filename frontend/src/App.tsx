import { useState, useEffect } from 'react';
import { login, obtenerClientes, obtenerServicios} from './api';
import AdminPanel from './AdminPanel';
import TecnicoPanel from './TecnicoPanel';
import PlanesPanel from './PlanesPanel';
import ServiciosPanel from './ServiciosPanel';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [rol, setRol] = useState<string | null>(localStorage.getItem('rol'));
  const [clientes, setClientes] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && rol === 'administrador') {
      cargarClientes(token);
      cargarServicios(token);
    }
  }, [token, rol]);

  useEffect(() => {
    function alVolverElFoco() {
      if (token && rol === 'administrador') {
        cargarClientes(token);
        cargarServicios(token);
      }
    }

  window.addEventListener('focus', alVolverElFoco);
  return () => window.removeEventListener('focus', alVolverElFoco);
}, [token, rol]);

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError('');

  try {
    const { token: tokenObtenido, rol: rolObtenido } = await login(email, password);
    setToken(tokenObtenido);
    setRol(rolObtenido);
    localStorage.setItem('token', tokenObtenido);
    localStorage.setItem('rol', rolObtenido);
    if (rolObtenido === 'administrador') {
      await cargarClientes(tokenObtenido);
      await cargarServicios(tokenObtenido);
    }
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
          <>
            <AdminPanel
              token={token}
              clientes={clientes}
              onClienteCreado={() => cargarClientes(token)}
              onServicioCreado={() => cargarServicios(token)}
            />

            <PlanesPanel
              token={token}
              clientes={clientes}
              onServiciosGenerados={() => cargarServicios(token)}
            />

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

            <ServiciosPanel
              token={token}
              servicios={servicios}
              onCambio={() => cargarServicios(token)}
            />
          </>
        )}

        {rol === 'tecnico' && <TecnicoPanel token={token} />}
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