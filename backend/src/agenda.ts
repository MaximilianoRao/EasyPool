import { pool } from './db';

export async function haySuperposicion(
  tecnicoId: number,
  fechaHora: string,
  duracionMinutos: number,
  servicioIdExcluir: number | null
): Promise<boolean> {
  const resultado = await pool.query(
    `SELECT id FROM servicio
     WHERE tecnico_id = $1
       AND estado IN ('pendiente', 'en_camino', 'en_servicio')
       AND ($4::int IS NULL OR id != $4)
       AND fecha_hora < ($2::timestamp + ($3 || ' minutes')::interval)
       AND $2::timestamp < (fecha_hora + (duracion_minutos || ' minutes')::interval)`,
    [tecnicoId, fechaHora, duracionMinutos, servicioIdExcluir]
  );

  return (resultado.rowCount ?? 0) > 0;
}