import { useState, useEffect } from 'react';
import { obtenerTecnicos, obtenerRutaSugerida } from './api';
import { formatearHora } from './fechas';
import { boton, campo, etiqueta, tarjeta, titulo } from './estilos';

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

  return (
    <section className={tarjeta}>
      <h2 className={titulo}>Ruta sugerida</h2>

      <form onSubmit={handleCalcular} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className={etiqueta}>Técnico</label>
          <select
            className={campo}
            value={tecnicoSeleccionado}
            onChange={(e) => setTecnicoSeleccionado(e.target.value)}
            required
          >
            <option value="">Elegir técnico</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} ({t.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={etiqueta}>Día</label>
          <input className={campo} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
        </div>
        <button type="submit" className={boton}>
          Ver ruta sugerida
        </button>
      </form>

      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {ruta && ruta.actual.length === 0 && (
        <p className="mt-3 text-sm text-gray-600">Ese técnico no tiene servicios activos ese día.</p>
      )}
      {ruta && ruta.actual.length === 1 && (
        <p className="mt-3 text-sm text-gray-600">Con un solo servicio no hay nada para reordenar.</p>
      )}

      {ruta && ruta.actual.length >= 2 && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Orden actual (por horario): {ruta.distancia_actual_km} km</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {ruta.actual.map((s: any) => (
                  <li key={s.id}>
                    {formatearHora(s.fecha_hora)} · {s.cliente_nombre} · {s.direccion}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Orden sugerido (por cercanía): {ruta.distancia_sugerida_km} km</h3>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {ruta.sugerido.map((s: any) => (
                  <li key={s.id}>
                    {formatearHora(s.fecha_hora)} · {s.cliente_nombre} · {s.direccion}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {ruta.ahorro_km > 0 ? (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
              Siguiendo el orden sugerido se recorrerían {ruta.ahorro_km} km menos.
            </p>
          ) : (
            <p className="rounded-lg bg-gray-100 p-3 text-sm">
              El orden actual ya es igual o mejor que el sugerido: no hace falta reordenar.
            </p>
          )}

          <p className="text-xs text-gray-500">
            Es solo una propuesta. Las distancias son en línea recta, no por calles. Para adoptarla hay que
            reprogramar los horarios desde la lista de servicios.
          </p>
        </div>
      )}
    </section>
  );
}

export default RutasPanel;