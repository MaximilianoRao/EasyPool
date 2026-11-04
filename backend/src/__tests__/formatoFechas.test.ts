import { formatearFechaHora } from '../notificaciones';

describe('Formato de fechas en los mensajes', () => {
  it('muestra la fecha como DD/MM/AAAA y la hora como HH:MM', () => {
    expect(formatearFechaHora('2026-11-03T08:00:00')).toBe('03/11/2026 08:00');
  });

  it('acepta también el formato con espacio y sin segundos', () => {
    expect(formatearFechaHora('2026-11-03 08:30')).toBe('03/11/2026 08:30');
    expect(formatearFechaHora('2026-11-03T08:30')).toBe('03/11/2026 08:30');
  });

  it('si el texto no tiene formato de fecha, lo devuelve sin cambios', () => {
    expect(formatearFechaHora('sin fecha')).toBe('sin fecha');
  });
});