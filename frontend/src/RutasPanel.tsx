import { useState, useEffect } from 'react';
import { obtenerTecnicos, obtenerRutaSugerida } from './api';

function RutasPanel({ token }: { token: string }) {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState('');
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('en-CA')); // hoy, formato AAAA-MM-DD
  const [ruta, setRuta] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerTecnicos(token).then(setTecnicos).catch(console.error);
  }, [token]);

  async function handleCalcular(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setRuta(null);

    try {
      setRuta(await obtenerRutaSugerida(token, Number(tecnicoSeleccionado), fecha));
    } catch (err: any) {
      setError(err.message || 'No se pudo calcular la ruta sugerida');
    }
  }

  function hora(fechaHora: string) {
    return fechaHora.slice(11, 16);
  }

  return (
    <div>
      <h2>Ruta sugerida</h2>
      <form onSubmit={handleCalcular}>
        <select value={tecnicoSeleccionado} onChange={(e) => setTecnicoSeleccionado(e.target.value)} required>
          <option value="">Elegir técnico</option>
          {tecnicos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.email})
            </option>
          ))}
        </select>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        <button type="submit">Ver ruta sugerida</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {ruta && ruta.actual.length === 0 && <p>Ese técnico no tiene servicios activos ese día.</p>}
      {ruta && ruta.actual.length === 1 && <p>Con un solo servicio no hay nada para reordenar.</p>}

      {ruta && ruta.actual.length >= 2 && (
        <div>
          <h3>Orden actual (por horario): {ruta.distancia_actual_km} km</h3>
          <ol>
            {ruta.actual.map((s: any) => (
              <li key={s.id}>
                {hora(s.fecha_hora)} — {s.cliente_nombre} — {s.direccion}
              </li>
            ))}
          </ol>

          <h3>Orden sugerido (por cercanía): {ruta.distancia_sugerida_km} km</h3>
          <ol>
            {ruta.sugerido.map((s: any) => (
              <li key={s.id}>
                {hora(s.fecha_hora)} — {s.cliente_nombre} — {s.direccion}
              </li>
            ))}
          </ol>

          {ruta.ahorro_km > 0 ? (
            <p>Siguiendo el orden sugerido se recorrerían {ruta.ahorro_km} km menos.</p>
          ) : (
            <p>El orden actual ya es igual o mejor que el sugerido: no hace falta reordenar.</p>
          )}

          <p>
            <small>
              Es solo una propuesta. Las distancias son en línea recta, no por calles. Para adoptarla hay que
              reprogramar los horarios desde la lista de servicios.
            </small>
          </p>
        </div>
      )}
    </div>
  );
}

export default RutasPanel;