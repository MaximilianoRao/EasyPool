import { useState, useEffect } from 'react';
import { login, obtenerClientes, obtenerServicios } from './api';
import AdminPanel from './AdminPanel';
import TecnicoPanel from './TecnicoPanel';
import PlanesPanel from './PlanesPanel';
import ServiciosPanel from './ServiciosPanel';
import RutasPanel from './RutasPanel';
import Notificaciones from './Notificaciones';
import { boton, botonChico, campo, etiqueta, tarjeta, titulo } from './estilos';

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
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
            <h1 className="text-xl font-bold">EasyPool</h1>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-600 sm:inline">
                {rol === 'administrador' ? 'Administrador' : 'Técnico'}
              </span>
              <button onClick={handleLogout} className={botonChico}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-6 px-4 py-4">
          {rol === 'administrador' && (
            <>
              <Notificaciones token={token} onNuevas={() => cargarServicios(token)} />

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

              <section className={tarjeta}>
                <h2 className={titulo}>Clientes</h2>
                {clientes.length === 0 ? (
                  <p className="text-sm text-gray-600">No hay clientes cargados todavía.</p>
                ) : (
                  <ul className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    {clientes.map((c) => (
                      <li key={c.id}>{c.nombre}</li>
                    ))}
                  </ul>
                )}
              </section>

              <ServiciosPanel
                token={token}
                servicios={servicios}
                onCambio={() => cargarServicios(token)}
              />

              <RutasPanel token={token} />
            </>
          )}

          {rol === 'tecnico' && <TecnicoPanel token={token} />}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className={`${tarjeta} w-full max-w-sm space-y-4`}>
        <h1 className="text-center text-2xl font-bold">EasyPool</h1>

        <div>
          <label className={etiqueta}>Email</label>
          <input
            type="email"
            autoComplete="username"
            className={campo}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={etiqueta}>Contraseña</label>
          <input
            type="password"
            autoComplete="current-password"
            className={campo}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={`${boton} w-full`}>
          Ingresar
        </button>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </form>
    </div>
  );
}

export default App;