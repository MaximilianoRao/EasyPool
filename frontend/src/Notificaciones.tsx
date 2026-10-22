import { useState, useEffect, useRef } from 'react';
import { obtenerNotificaciones, marcarNotificacionesLeidas } from './api';

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
      <button onClick={() => setAbierto(!abierto)}>
        Notificaciones{noLeidas > 0 ? ` (${noLeidas})` : ''}
      </button>

      {abierto && (
        <div>
          {notificaciones.length === 0 ? (
            <p>No tenés notificaciones.</p>
          ) : (
            <>
              {noLeidas > 0 && <button onClick={handleMarcarTodas}>Marcar todas como leídas</button>}
              <ul>
                {notificaciones.map((n) => (
                  <li key={n.id} style={{ fontWeight: n.leida ? 'normal' : 'bold' }}>
                    {new Date(n.creada_en).toLocaleString()} — {n.mensaje}
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