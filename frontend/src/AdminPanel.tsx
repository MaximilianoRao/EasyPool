import { useState, useEffect } from 'react';
import {
  crearCliente,
  crearUbicacion,
  obtenerUbicaciones,
  obtenerTecnicos,
  crearServicio,
  asignarTecnico,
} from './api';
import { boton, campo, etiqueta, tarjeta, titulo } from './estilos';

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
  // --- formulario de cliente ---
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [mensaje, setMensaje] = useState('');

  // --- formulario de servicio ---
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState('60');
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
      const servicio = await crearServicio(token, Number(ubicacionSeleccionada), fechaHora, Number(duracionMinutos));
      let mensajeFinal = 'Servicio creado correctamente.';

      if (tecnicoSeleccionado) {
        try {
          await asignarTecnico(token, servicio.id, Number(tecnicoSeleccionado), servicio.version);
        } catch (err: any) {
          mensajeFinal = `Servicio creado, pero quedó sin técnico: ${err.message}`;
        }
      }

      setMensajeServicio(mensajeFinal);
      onServicioCreado();
      setClienteSeleccionado('');
      setFechaHora('');
      setDuracionMinutos('60');
      setTecnicoSeleccionado('');
    } catch (err) {
      setMensajeServicio('Ocurrió un error al crear el servicio.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={tarjeta}>
        <h2 className={titulo}>Nuevo cliente</h2>
        <form onSubmit={handleCrearCliente} className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={etiqueta}>Nombre</label>
            <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <label className={etiqueta}>Teléfono</label>
            <input className={campo} type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={etiqueta}>Dirección</label>
            <input className={campo} value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div>
            <label className={etiqueta}>Latitud</label>
            <input
              className={campo}
              type="number"
              step="any"
              min={-90}
              max={90}
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={etiqueta}>Longitud</label>
            <input
              className={campo}
              type="number"
              step="any"
              min={-180}
              max={180}
              value={longitud}
              onChange={(e) => setLongitud(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={`${boton} w-full sm:w-auto`}>
              Crear cliente
            </button>
          </div>
        </form>
        {mensaje && <p className="mt-3 rounded-lg bg-gray-100 p-3 text-sm">{mensaje}</p>}
      </section>

      <section className={tarjeta}>
        <h2 className={titulo}>Nuevo servicio</h2>
        <form onSubmit={handleCrearServicio} className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={etiqueta}>Cliente</label>
            <select
              className={campo}
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={etiqueta}>Ubicación</label>
            <select
              className={campo}
              value={ubicacionSeleccionada}
              onChange={(e) => setUbicacionSeleccionada(e.target.value)}
              required
            >
              <option value="">Seleccionar ubicación</option>
              {ubicaciones.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.direccion}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={etiqueta}>Fecha y hora</label>
            <input
              className={campo}
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={etiqueta}>Duración (minutos)</label>
            <input
              className={campo}
              type="number"
              min={1}
              value={duracionMinutos}
              onChange={(e) => setDuracionMinutos(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={etiqueta}>Técnico (opcional)</label>
            <select
              className={campo}
              value={tecnicoSeleccionado}
              onChange={(e) => setTecnicoSeleccionado(e.target.value)}
            >
              <option value="">Sin asignar</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={`${boton} w-full sm:w-auto`}>
              Crear servicio
            </button>
          </div>
        </form>
        {mensajeServicio && <p className="mt-3 rounded-lg bg-gray-100 p-3 text-sm">{mensajeServicio}</p>}
      </section>
    </div>
  );
}

export default AdminPanel;