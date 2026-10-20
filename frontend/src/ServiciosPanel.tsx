import { useState, useEffect } from 'react';
import { obtenerTecnicos, asignarTecnico, cancelarServicio, reprogramarServicio } from './api';

function ServiciosPanel({
  token,
  servicios,
  onCambio,
}: {
  token: string;
  servicios: any[];
  onCambio: () => void;
}) {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [tecnicoPorServicio, setTecnicoPorServicio] = useState<Record<number, string>>({});
  const [fechaPorServicio, setFechaPorServicio] = useState<Record<number, string>>({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerTecnicos(token).then(setTecnicos).catch(console.error);
  }, [token]);

  async function ejecutar(accion: () => Promise<unknown>) {
    setMensaje('');
    try {
      await accion();
    } catch (err: any) {
      setMensaje(err.message || 'No se pudo completar la operación.');
    }
    onCambio();
  }

  function handleAsignar(s: any) {
    const tecnicoId = tecnicoPorServicio[s.id];
    if (!tecnicoId) return;
    ejecutar(() => asignarTecnico(token, s.id, Number(tecnicoId), s.version));
  }

  function handleReprogramar(s: any) {
    const fecha = fechaPorServicio[s.id];
    if (!fecha) return;
    ejecutar(() => reprogramarServicio(token, s.id, s.version, fecha));
  }

  function handleCancelar(s: any) {
    const motivo = window.prompt('Motivo de la cancelación (opcional):');
    if (motivo === null) return;
    ejecutar(() => cancelarServicio(token, s.id, s.version, motivo));
  }

  const puedeAsignar = (estado: string) => estado === 'pendiente' || estado === 'en_camino';
  const puedeCancelarOReprogramar = (estado: string) =>
    ['pendiente', 'en_camino', 'no_realizado'].includes(estado);

  return (
    <div>
      <h2>Servicios</h2>
      {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}

      {servicios.length === 0 ? (
        <p>No hay servicios cargados todavía.</p>
      ) : (
        <ul>
          {servicios.map((s) => (
            <li key={s.id} style={{ marginBottom: '16px' }}>
              <strong>{s.cliente_nombre}</strong> — {s.direccion}
              <br />
              {s.fecha_hora.slice(0, 16).replace('T', ' ')} ({s.duracion_minutos} min) — estado: {s.estado}
              <br />
              Técnico: {s.tecnico_email || 'sin asignar'}
              {s.motivo_no_realizado && (
                <>
                  <br />
                  Motivo no realizado: {s.motivo_no_realizado}
                </>
              )}
              {s.observaciones && (
                <>
                  <br />
                  Observaciones: {s.observaciones}
                </>
              )}

              {puedeAsignar(s.estado) && (
                <div>
                  <select
                    value={tecnicoPorServicio[s.id] || ''}
                    onChange={(e) => setTecnicoPorServicio({ ...tecnicoPorServicio, [s.id]: e.target.value })}
                  >
                    <option value="">Elegir técnico</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} ({t.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleAsignar(s)}>{s.tecnico_id ? 'Reasignar' : 'Asignar'}</button>
                </div>
              )}

              {puedeCancelarOReprogramar(s.estado) && (
                <div>
                  <input
                    type="datetime-local"
                    value={fechaPorServicio[s.id] || ''}
                    onChange={(e) => setFechaPorServicio({ ...fechaPorServicio, [s.id]: e.target.value })}
                  />
                  <button onClick={() => handleReprogramar(s)}>Reprogramar</button>
                  <button onClick={() => handleCancelar(s)} style={{ marginLeft: '10px' }}>
                    Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServiciosPanel;