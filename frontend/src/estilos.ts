// Clases de Tailwind reutilizables, para no repetir cadenas largas en cada pantalla.

export const boton =
  'rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700 active:bg-blue-800';

export const botonSecundario =
  'rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-100';

export const botonPeligro =
  'rounded-lg border border-red-300 bg-white px-4 py-3 text-base font-medium text-red-700 hover:bg-red-50';

// Versión más chica, para acciones secundarias
export const botonChico =
  'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100';

export const campo = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base';
export const etiqueta = 'mb-1 block text-sm font-medium text-gray-700';
export const tarjeta = 'rounded-xl border border-gray-200 bg-white p-4 shadow-sm';
export const titulo = 'mb-3 text-xl font-semibold';

export const nombreEstado: Record<string, string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  en_servicio: 'En servicio',
  finalizado: 'Finalizado',
  no_realizado: 'No realizado',
  cancelado: 'Cancelado',
};

const colorEstado: Record<string, string> = {
  pendiente: 'bg-gray-100 text-gray-800',
  en_camino: 'bg-blue-100 text-blue-800',
  en_servicio: 'bg-amber-100 text-amber-800',
  finalizado: 'bg-green-100 text-green-800',
  no_realizado: 'bg-orange-100 text-orange-800',
  cancelado: 'bg-red-100 text-red-800',
};

export function claseEstado(estado: string): string {
  return `inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorEstado[estado] ?? 'bg-gray-100 text-gray-800'}`;
}