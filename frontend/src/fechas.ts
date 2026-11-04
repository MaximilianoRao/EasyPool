// Las fechas se guardan y viajan en formato ISO (AAAA-MM-DDTHH:MM:SS).
// Solo se convierten a DD/MM/AAAA al mostrarlas en pantalla.

const FORMATO_ISO = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;


export function formatearFechaHora(fechaHora: string): string {
  const partes = fechaHora.match(FORMATO_ISO);
  if (!partes) return fechaHora;
  return `${partes[3]}/${partes[2]}/${partes[1]} ${partes[4]}:${partes[5]}`;
}


export function formatearHora(fechaHora: string): string {
  const partes = fechaHora.match(FORMATO_ISO);
  if (!partes) return fechaHora;
  return `${partes[4]}:${partes[5]}`;
}

// Instante en que ocurrió algo (ej. una notificación): llega como momento absoluto
// y se muestra en la hora local del dispositivo.
export function formatearInstante(instante: string): string {
  const fecha = new Date(instante);
  if (isNaN(fecha.getTime())) return instante;

  const dd = String(fecha.getDate()).padStart(2, '0');
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const hh = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${fecha.getFullYear()} ${hh}:${min}`;
}