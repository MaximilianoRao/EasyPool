import { PoolClient } from 'pg';

export function formatearFechaHora(fechaHora: string): string {
  return fechaHora.slice(0, 16).replace('T', ' ');
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