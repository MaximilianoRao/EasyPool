import { useState } from 'react';
import { login, obtenerClientes } from './api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [clientes, setClientes] = useState<any[]>([]);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const tokenObtenido = await login(email, password);
      setToken(tokenObtenido);

      const listaClientes = await obtenerClientes(tokenObtenido);
      setClientes(listaClientes);
    } catch (err) {
      setError('No se pudo iniciar sesión. Revisá el email y la contraseña.');
    }
  }

  if (token) {
    return (
      <div>
        <h1>EasyPool</h1>
        <p>Sesión iniciada correctamente.</p>
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