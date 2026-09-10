import { useState, useEffect } from 'react';
import { login, obtenerClientes } from './api';
import AdminPanel from './AdminPanel';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [clientes, setClientes] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
    cargarClientes(token);
    }
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const tokenObtenido = await login(email, password);
      setToken(tokenObtenido);
      localStorage.setItem('token', tokenObtenido);
      await cargarClientes(tokenObtenido);
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

  function handleLogout() {
    setToken(null);
    localStorage.removeItem('token');
    setEmail('');
    setPassword('');
  }

  if (token) {
    return (
      <div>
        <h1>EasyPool</h1>
        <p>Sesión iniciada correctamente.</p>
        <button onClick={handleLogout}>Cerrar sesión</button>
        <AdminPanel token={token} onClienteCreado={() => cargarClientes(token)} />
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