import { useState, useEffect } from 'react';
import { obtenerTecnicos, asignarTecnico, cancelarServicio, reprogramarServicio } from './api';
import { formatearFechaHora } from './fechas';
import { boton, botonChico, botonPeligro, campo, tarjeta, titulo, claseEstado, nombreEstado } from './estilos';

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
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    obtenerTecnicos(token).then(setTecnicos).catch(console.error);
  }, [token]);

  async function ejecutar(accion: () => Promise<unknown>, textoExito: string) {
  setMensaje('');
  setExito('');
  try {
    await accion();
    setExito(textoExito);
  } catch (err: any) {
    setMensaje(err.message || 'No se pudo completar la operación.');
  }
  onCambio();
  }

  function handleAsignar(s: any) {
  const tecnicoId = tecnicoPorServicio[s.id];
  if (!tecnicoId) return;
  ejecutar(
    () => asignarTecnico(token, s.id, Number(tecnicoId), s.version),
    s.tecnico_id ? 'Servicio reasignado correctamente.' : 'Técnico asignado correctamente.'
  );
  }

  function handleReprogramar(s: any) {
    const fecha = fechaPorServicio[s.id];
    if (!fecha) return;
    ejecutar(() => reprogramarServicio(token, s.id, s.version, fecha), 'Servicio reprogramado correctamente.');
  }

  function handleCancelar(s: any) {
    const motivo = window.prompt('Motivo de la cancelación (opcional):');
    if (motivo === null) return;
    ejecutar(() => cancelarServicio(token, s.id, s.version, motivo), 'Servicio cancelado.');
  }


  const puedeAsignar = (estado: string) => estado === 'pendiente' || estado === 'en_camino';
  const puedeCancelarOReprogramar = (estado: string) =>
    ['pendiente', 'en_camino', 'no_realizado'].includes(estado);

  const serviciosVisibles = fechaFiltro
    ? servicios.filter((s) => s.fecha_hora.startsWith(fechaFiltro))
    : servicios;

  return (
    <section className={tarjeta}>
      <h2 className={titulo}>Servicios</h2>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-medium text-gray-700">Filtrar por día</label>
        <input
          type="date"
          className={`${campo} sm:w-auto`}
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />
        {fechaFiltro && (
          <button onClick={() => setFechaFiltro('')} className={botonChico}>
            Ver todos
          </button>
        )}
        <span className="text-sm text-gray-600">
          Mostrando {serviciosVisibles.length} de {servicios.length}
        </span>
      </div>

      {mensaje && <p className="sticky top-2 z-10 mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 shadow">{mensaje}</p>}
      {exito && <p className="sticky top-2 z-10 mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-800 shadow">{exito}</p>}

      {serviciosVisibles.length === 0 ? (
        <p className="text-sm text-gray-600">No hay servicios para mostrar.</p>
      ) : (
        <ul className="space-y-3">
          {serviciosVisibles.map((s) => (
            <li key={s.id} className="space-y-2 rounded-lg border border-gray-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{s.cliente_nombre}</p>
                  <p className="text-sm text-gray-600">{s.direccion}</p>
                </div>
                <span className={claseEstado(s.estado)}>{nombreEstado[s.estado] ?? s.estado}</span>
              </div>

              <p className="text-sm text-gray-700">
                {formatearFechaHora(s.fecha_hora)} · {s.duracion_minutos} min · Técnico:{' '}
                {s.tecnico_email || 'sin asignar'}
              </p>

              {s.motivo_no_realizado && (
                <p className="rounded-lg bg-orange-50 p-2 text-sm text-orange-800">
                  Motivo no realizado: {s.motivo_no_realizado}
                </p>
              )}
              {s.observaciones && (
                <p className="rounded-lg bg-gray-50 p-2 text-sm text-gray-700">Observaciones: {s.observaciones}</p>
              )}

              {puedeAsignar(s.estado) && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    className={campo}
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
                  <button onClick={() => handleAsignar(s)} className={`${boton} sm:whitespace-nowrap`}>
                    {s.tecnico_id ? 'Reasignar' : 'Asignar'}
                  </button>
                </div>
              )}

              {puedeCancelarOReprogramar(s.estado) && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="datetime-local"
                    className={campo}
                    value={fechaPorServicio[s.id] || ''}
                    onChange={(e) => setFechaPorServicio({ ...fechaPorServicio, [s.id]: e.target.value })}
                  />
                  <button onClick={() => handleReprogramar(s)} className={`${boton} sm:whitespace-nowrap`}>
                    Reprogramar
                  </button>
                  <button onClick={() => handleCancelar(s)} className={botonPeligro}>
                    Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ServiciosPanel;