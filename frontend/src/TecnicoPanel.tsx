import { useState, useEffect } from 'react';
import { obtenerMisServicios, cambiarEstado, marcarNoRealizado } from './api';

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

function TecnicoPanel({ token }: { token: string }) {
  const [servicios, setServicios] = useState<any[]>([]);
  const [error, setError] = useState('');

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
      setError(err.message || 'No se pudo cambiar el estado');
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
      setError(err.message || 'No se pudo marcar el servicio como no realizado');
      await cargar();
    }
  }

  return (
    <div>
      <h2>Mis Servicios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {servicios.length === 0 ? (
        <p>No tenés servicios asignados todavía.</p>
      ) : (
        <ul>
          {servicios.map((s) => (
            <li key={s.id}>
              {s.fecha_hora} — estado: {s.estado}
              {siguienteEstado[s.estado] && (
                <button onClick={() => handleCambiarEstado(s)} style={{ marginLeft: '10px' }}>
                  {textoBoton[s.estado]}
                </button>
              )}
              {(s.estado === 'en_camino' || s.estado === 'en_servicio') && (
                <button onClick={() => handleNoRealizado(s)} style={{ marginLeft: '10px' }}>
                  No realizado
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TecnicoPanel;