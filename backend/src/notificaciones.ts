import { PoolClient } from 'pg';

export function formatearFechaHora(fechaHora: string): string {
  const partes = fechaHora.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!partes) return fechaHora;
  return `${partes[3]}/${partes[2]}/${partes[1]} ${partes[4]}:${partes[5]}`;
}

export async function crearNotificacion(client: PoolClient, usuarioId: number, servicioId: number, mensaje: string) {
  await client.query(
    'INSERT INTO notificacion (usuario_id, servicio_id, mensaje) VALUES ($1, $2, $3)',
    [usuarioId, servicioId, mensaje]
  );
}

export async function notificarAdministradores(client: PoolClient, servicioId: number, mensaje: string) {
  await client.query(
    `INSERT INTO notificacion (usuario_id, servicio_id, mensaje)
     SELECT id, $1::int, $2::text FROM usuario WHERE rol = 'administrador'`,
    [servicioId, mensaje]
  );
}