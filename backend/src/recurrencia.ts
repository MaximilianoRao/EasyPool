import { pool } from './db';

function sumarDias(fecha: Date, dias: number): Date {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

function sumarMeses(fecha: Date, meses: number): Date {
  const resultado = new Date(fecha);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

function siguienteFecha(fecha: Date, frecuencia: string): Date {
  if (frecuencia === 'semanal') return sumarDias(fecha, 7);
  if (frecuencia === 'quincenal') return sumarDias(fecha, 14);
  return sumarMeses(fecha, 1); // mensual
}

export async function generarServiciosDesdePlanes(horizonteDias = 30) {
  const limite = sumarDias(new Date(), horizonteDias);
  const planesResultado = await pool.query('SELECT * FROM plan_mantenimiento WHERE activo = true');

  let totalGenerados = 0;

  for (const plan of planesResultado.rows) {
    let proxima = new Date(plan.proxima_generacion);

    while (proxima <= limite) {
      const insertado = await pool.query(
        `INSERT INTO servicio (ubicacion_id, plan_id, fecha_hora)
         VALUES ($1, $2, $3)
         ON CONFLICT (plan_id, fecha_hora) DO NOTHING
         RETURNING id`,
        [plan.ubicacion_id, plan.id, proxima]
      );

      if ((insertado.rowCount ?? 0) > 0) totalGenerados++;

      proxima = siguienteFecha(proxima, plan.frecuencia);
    }

    await pool.query('UPDATE plan_mantenimiento SET proxima_generacion = $1 WHERE id = $2', [proxima, plan.id]);
  }

  return totalGenerados;
}