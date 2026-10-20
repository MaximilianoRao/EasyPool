import { useState, useEffect } from 'react';
import { obtenerUbicaciones, obtenerPlanes, crearPlan, cambiarEstadoPlan, generarServicios } from './api';

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
    <div>
      <h2>Planes de Mantenimiento</h2>
      <form onSubmit={handleCrearPlan}>
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
          <label>Frecuencia: </label>
          <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
        <div>
          <label>Primera visita: </label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Duración (minutos): </label>
          <input
            type="number"
            value={duracionMinutos}
            onChange={(e) => setDuracionMinutos(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear plan</button>
      </form>

      <button onClick={handleGenerar} style={{ marginTop: '12px' }}>
        Generar servicios de los próximos 30 días
      </button>
      {mensaje && <p>{mensaje}</p>}

      {planes.length === 0 ? (
        <p>No hay planes cargados todavía.</p>
      ) : (
        <ul>
          {planes.map((p) => (
            <li key={p.id}>
              {p.cliente_nombre} — {p.direccion} — {p.frecuencia}, desde{' '}
              {p.fecha_inicio.slice(0, 16).replace('T', ' ')} ({p.duracion_minutos} min) —{' '}
              {p.activo ? 'activo' : 'pausado'}
              <button onClick={() => handlePausarReactivar(p)} style={{ marginLeft: '10px' }}>
                {p.activo ? 'Pausar' : 'Reactivar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanesPanel;