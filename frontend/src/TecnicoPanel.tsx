import { useState, useEffect } from 'react';
import { obtenerMisServicios, cambiarEstado, marcarNoRealizado, guardarObservaciones } from './api';
import Notificaciones from './Notificaciones';
import { formatearFechaHora } from './fechas';
import { boton, botonSecundario, botonPeligro, tarjeta, claseEstado, nombreEstado } from './estilos';

const siguienteEstado: Record<string, string> = {
  pendiente: 'en_camino',
  en_camino: 'en_servicio',
  en_servicio: 'finalizado',
};

const textoBoton: Record<string, string> = {
  pendiente: 'Marcar en camino',
  en_camino: 'Marcar en servicio',
  en_servicio: 'Finalizar servicio',
};

// Si el pedido ni siquiera llegó al servidor, fetch lanza un TypeError: es un problema de conexión
function mensajeDeError(err: any, porDefecto: string): string {
  if (err instanceof TypeError) return 'No hay conexión. Probá de nuevo en unos segundos.';
  return err?.message || porDefecto;
}

function TecnicoPanel({ token }: { token: string }) {
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [soloHoy, setSoloHoy] = useState(true);

  async function cargar() {
    try {
      const lista = await obtenerMisServicios(token);
      setServicios(lista);
    } catch (err) {
      console.error('Error al cargar mis servicios:', err);
    }
  }

  useEffect(() => {
    cargar();
  }, [token]);

  async function handleCambiarEstado(servicio: any) {
    setError('');
    const nuevoEstado = siguienteEstado[servicio.estado];
    if (!nuevoEstado) return;

    try {
      await cambiarEstado(token, servicio.id, nuevoEstado, servicio.version);
      await cargar();
    } catch (err: any) {
      setError(mensajeDeError(err, 'No se pudo cambiar el estado'));
      await cargar(); // por si el error es de versión desactualizada, traemos el estado real
    }
  }

  async function handleNoRealizado(servicio: any) {
    setError('');
    const motivo = window.prompt('¿Por qué no se pudo realizar el servicio?');
    if (!motivo) return;

    try {
      await marcarNoRealizado(token, servicio.id, motivo, servicio.version);
      await cargar();
    } catch (err: any) {
      setError(mensajeDeError(err, 'No se pudo marcar el servicio como no realizado'));
      await cargar();
    }
  }

  async function handleObservaciones(servicio: any) {
    setError('');
    const texto = window.prompt('Observaciones del servicio:', servicio.observaciones || '');
    if (texto === null) return;

    try {
      await guardarObservaciones(token, servicio.id, texto);
      await cargar();
    } catch (err: any) {
      setError(mensajeDeError(err, 'No se pudieron guardar las observaciones'));
    }
  }

  function esHoy(fechaHora: string) {
    return new Date(fechaHora).toDateString() === new Date().toDateString();
  }

  const serviciosVisibles = soloHoy ? servicios.filter((s) => esHoy(s.fecha_hora)) : servicios;

  return (
    <div className="space-y-4">
      <Notificaciones token={token} onNuevas={cargar} />

      <h2 className="text-xl font-semibold">Mis servicios</h2>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={soloHoy}
          onChange={(e) => setSoloHoy(e.target.checked)}
        />
        Solo servicios de hoy
      </label>

      {serviciosVisibles.length === 0 ? (
        <p className="text-gray-600">No tenés servicios para mostrar.</p>
      ) : (
        <ul className="space-y-3">
          {serviciosVisibles.map((s) => (
            <li key={s.id} className={`${tarjeta} space-y-2`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{s.cliente_nombre}</p>
                  <p className="text-gray-600">{s.direccion}</p>
                </div>
                <span className={claseEstado(s.estado)}>{nombreEstado[s.estado] ?? s.estado}</span>
              </div>

              <p className="text-sm text-gray-700">
                {formatearFechaHora(s.fecha_hora)} · {s.duracion_minutos} min
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {s.cliente_telefono && (
                  <a href={`tel:${s.cliente_telefono}`} className="text-blue-700 underline">
                    Llamar al {s.cliente_telefono}
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps?q=${s.latitud},${s.longitud}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  Ver en mapa
                </a>
              </div>

              {s.motivo_no_realizado && (
                <p className="rounded-lg bg-orange-50 p-2 text-sm text-orange-800">
                  Motivo: {s.motivo_no_realizado}
                </p>
              )}
              {s.observaciones && (
                <p className="rounded-lg bg-gray-50 p-2 text-sm text-gray-700">Observaciones: {s.observaciones}</p>
              )}

              <div className="flex flex-col gap-2 pt-1">
                {siguienteEstado[s.estado] && (
                  <button onClick={() => handleCambiarEstado(s)} className={`${boton} w-full`}>
                    {textoBoton[s.estado]}
                  </button>
                )}

                <div className="flex gap-2">
                  {(s.estado === 'en_camino' || s.estado === 'en_servicio') && (
                    <button onClick={() => handleNoRealizado(s)} className={`${botonPeligro} flex-1`}>
                      No realizado
                    </button>
                  )}
                  {s.estado !== 'pendiente' && s.estado !== 'cancelado' && (
                    <button onClick={() => handleObservaciones(s)} className={`${botonSecundario} flex-1`}>
                      Observaciones
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TecnicoPanel;