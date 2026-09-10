import { useState, useEffect } from 'react';
import {
  crearCliente,
  crearUbicacion,
  obtenerUbicaciones,
  obtenerTecnicos,
  crearServicio,
  asignarTecnico,
} from './api';

function AdminPanel({
  token,
  clientes,
  onClienteCreado,
  onServicioCreado,
}: {
  token: string;
  clientes: any[];
  onClienteCreado: () => void;
  onServicioCreado: () => void;
}) {
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [mensaje, setMensaje] = useState('');

  
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');
  const [mensajeServicio, setMensajeServicio] = useState('');

  useEffect(() => {
    obtenerTecnicos(token).then(setTecnicos).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (clienteSeleccionado) {
      obtenerUbicaciones(token, Number(clienteSeleccionado)).then(setUbicaciones).catch(console.error);
    } else {
      setUbicaciones([]);
    }
    setUbicacionSeleccionada('');
  }, [clienteSeleccionado, token]);

  async function handleCrearCliente(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    try {
      const cliente = await crearCliente(token, nombre, telefono);
      await crearUbicacion(token, cliente.id, direccion, Number(latitud), Number(longitud));

      setMensaje(`Cliente "${cliente.nombre}" creado con su ubicación.`);
      onClienteCreado();
      setNombre('');
      setTelefono('');
      setDireccion('');
      setLatitud('');
      setLongitud('');
    } catch (err) {
      setMensaje('Ocurrió un error al crear el cliente o la ubicación.');
    }
  }

  async function handleCrearServicio(e: React.FormEvent) {
    e.preventDefault();
    setMensajeServicio('');

    try {
      const servicio = await crearServicio(token, Number(ubicacionSeleccionada), fechaHora);

      if (tecnicoSeleccionado) {
        await asignarTecnico(token, servicio.id, Number(tecnicoSeleccionado));
      }

      setMensajeServicio('Servicio creado correctamente.');
      onServicioCreado();
      setClienteSeleccionado('');
      setFechaHora('');
      setTecnicoSeleccionado('');
    } catch (err) {
      setMensajeServicio('Ocurrió un error al crear el servicio.');
    }
  }

  return (
    <div>
      <h2>Nuevo Cliente</h2>
      <form onSubmit={handleCrearCliente}>
        <div>
          <label>Nombre: </label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono: </label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div>
          <label>Dirección: </label>
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div>
          <label>Latitud: </label>
          <input value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
        </div>
        <div>
          <label>Longitud: </label>
          <input value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
        </div>
        <button type="submit">Crear Cliente</button>
      </form>
      {mensaje && <p>{mensaje}</p>}

      <h2>Nuevo Servicio</h2>
      <form onSubmit={handleCrearServicio}>
        <div>
          <label>Cliente: </label>
          <select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)} required>
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Ubicación: </label>
          <select value={ubicacionSeleccionada} onChange={(e) => setUbicacionSeleccionada(e.target.value)} required>
            <option value="">Seleccionar ubicación</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>{u.direccion}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha y hora: </label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Técnico (opcional): </label>
          <select value={tecnicoSeleccionado} onChange={(e) => setTecnicoSeleccionado(e.target.value)}>
            <option value="">Sin asignar</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit">Crear Servicio</button>
      </form>
      {mensajeServicio && <p>{mensajeServicio}</p>}
    </div>
  );
}

export default AdminPanel;