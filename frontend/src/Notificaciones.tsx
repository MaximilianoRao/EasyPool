import { useState, useEffect, useRef } from 'react';
import { obtenerNotificaciones, marcarNotificacionesLeidas } from './api';
import { formatearInstante } from './fechas';
import { tarjeta, botonChico } from './estilos';

function Notificaciones({ token, onNuevas }: { token: string; onNuevas?: () => void }) {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [abierto, setAbierto] = useState(false);
  const noLeidasPrevias = useRef<number | null>(null);

  async function cargar() {
    try {
      const lista = await obtenerNotificaciones(token);
      const noLeidas = lista.filter((n: any) => !n.leida).length;

      if (noLeidasPrevias.current !== null && noLeidas > noLeidasPrevias.current && onNuevas) {
        onNuevas();
      }
      noLeidasPrevias.current = noLeidas;
      setNotificaciones(lista);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    }
  }

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 30000);
    window.addEventListener('focus', cargar);
    return () => {
      clearInterval(intervalo);
      window.removeEventListener('focus', cargar);
    };
  }, [token]);

  async function handleMarcarTodas() {
    try {
      await marcarNotificacionesLeidas(token);
      await cargar();
    } catch (err) {
      console.error('Error al marcar notificaciones:', err);
    }
  }

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div>
      <button onClick={() => setAbierto(!abierto)} className={botonChico}>
        Notificaciones
        {noLeidas > 0 && (
          <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            {noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className={`${tarjeta} mt-2 space-y-2`}>
          {notificaciones.length === 0 ? (
            <p className="text-sm text-gray-600">No tenés notificaciones.</p>
          ) : (
            <>
              {noLeidas > 0 && (
                <button onClick={handleMarcarTodas} className={botonChico}>
                  Marcar todas como leídas
                </button>
              )}
              <ul className="divide-y divide-gray-100">
                {notificaciones.map((n) => (
                  <li
                    key={n.id}
                    className={`py-2 text-sm ${n.leida ? 'text-gray-600' : 'font-semibold text-gray-900'}`}
                  >
                    <span className="block text-xs font-normal text-gray-500">{formatearInstante(n.creada_en)}</span>
                    {n.mensaje}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;