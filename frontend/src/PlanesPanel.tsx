import { useState, useEffect } from 'react';
import { obtenerUbicaciones, obtenerPlanes, crearPlan, cambiarEstadoPlan, generarServicios } from './api';
import { formatearFechaHora } from './fechas';
import { boton, botonSecundario, botonChico, campo, etiqueta, tarjeta, titulo } from './estilos';

function PlanesPanel({
  token,
  clientes,
  onServiciosGenerados,
}: {
  token: string;
  clientes: any[];
  onServiciosGenerados: () => void;
}) {
  const [planes, setPlanes] = useState<any[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [frecuencia, setFrecuencia] = useState('semanal');
  const [fechaInicio, setFechaInicio] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState('60');
  const [mensaje, setMensaje] = useState('');

  async function cargarPlanes() {
    try {
      setPlanes(await obtenerPlanes(token));
    } catch (err) {
      console.error('Error al cargar planes:', err);
    }
  }

  useEffect(() => {
    cargarPlanes();
  }, [token]);

  useEffect(() => {
    if (clienteSeleccionado) {
      obtenerUbicaciones(token, Number(clienteSeleccionado)).then(setUbicaciones).catch(console.error);
    } else {
      setUbicaciones([]);
    }
    setUbicacionSeleccionada('');
  }, [clienteSeleccionado, token]);

  async function handleCrearPlan(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    try {
      await crearPlan(token, Number(ubicacionSeleccionada), frecuencia, fechaInicio, Number(duracionMinutos));
      setMensaje('Plan creado correctamente.');
      setClienteSeleccionado('');
      setFrecuencia('semanal');
      setFechaInicio('');
      setDuracionMinutos('60');
      await cargarPlanes();
    } catch (err: any) {
      setMensaje(err.message || 'Ocurrió un error al crear el plan.');
    }
  }

  async function handlePausarReactivar(plan: any) {
    setMensaje('');
    try {
      await cambiarEstadoPlan(token, plan.id, plan.activo ? 'pausar' : 'reactivar');
      await cargarPlanes();
    } catch (err: any) {
      setMensaje(err.message || 'No se pudo actualizar el plan.');
    }
  }

  async function handleGenerar() {
    setMensaje('');
    try {
      const datos = await generarServicios(token);
      setMensaje(datos.mensaje);
      onServiciosGenerados();
      await cargarPlanes();
    } catch (err: any) {
      setMensaje(err.message || 'No se pudieron generar los servicios.');
    }
  }

  return (
    <section className={tarjeta}>
      <h2 className={titulo}>Planes de mantenimiento</h2>

      <form onSubmit={handleCrearPlan} className="grid gap-3 sm:grid-cols-2">
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
          <label className={etiqueta}>Frecuencia</label>
          <select className={campo} value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
        <div>
          <label className={etiqueta}>Primera visita</label>
          <input
            className={campo}
            type="datetime-local"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
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
        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
          <button type="submit" className={`${boton} w-full sm:w-auto`}>
            Crear plan
          </button>
          <button type="button" onClick={handleGenerar} className={`${botonSecundario} w-full sm:w-auto`}>
            Generar servicios de los próximos 30 días
          </button>
        </div>
      </form>

      {mensaje && <p className="mt-3 rounded-lg bg-gray-100 p-3 text-sm">{mensaje}</p>}

      {planes.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">No hay planes cargados todavía.</p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {planes.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <p className="font-medium">
                  {p.cliente_nombre} · {p.direccion}
                </p>
                <p className="text-gray-600">
                  {p.frecuencia}, desde {formatearFechaHora(p.fecha_inicio)} ({p.duracion_minutos} min) ·{' '}
                  <span className={p.activo ? 'text-green-700' : 'text-orange-700'}>
                    {p.activo ? 'activo' : 'pausado'}
                  </span>
                </p>
              </div>
              <button onClick={() => handlePausarReactivar(p)} className={botonChico}>
                {p.activo ? 'Pausar' : 'Reactivar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PlanesPanel;