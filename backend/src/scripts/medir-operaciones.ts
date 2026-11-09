// Mide el porcentaje de operaciones críticas exitosas y los tiempos de respuesta (OE6)
// sobre los datos del piloto. Recorre el flujo completo: el administrador asigna los
// servicios del día y cada técnico los lleva hasta 'finalizado'.
//
// Uso (desde backend/):
//   pnpm exec ts-node src/scripts/medir-operaciones.ts <URL del backend> <fecha AAAA-MM-DD> <email admin> <password admin> <password técnicos piloto>

const [urlBase, fecha, emailAdmin, passwordAdmin, passwordTecnicos] = process.argv.slice(2);

if (!urlBase || !fecha || !emailAdmin || !passwordAdmin || !passwordTecnicos) {
  console.error('Uso: ts-node src/scripts/medir-operaciones.ts <URL del backend> <fecha AAAA-MM-DD> <email admin> <password admin> <password técnicos piloto>');
  process.exit(1);
}

type Medicion = { operacion: string; ok: boolean; ms: number };
const mediciones: Medicion[] = [];

async function llamar(operacion: string, metodo: string, ruta: string, token?: string, cuerpo?: object) {
  const inicio = Date.now();
  let ok = false;
  let datos: any = null;

  try {
    const respuesta = await fetch(`${urlBase}${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    datos = await respuesta.json().catch(() => null);
    ok = respuesta.ok;
  } catch (error) {
    ok = false; // sin conexión o servidor caído
  }

  mediciones.push({ operacion, ok, ms: Date.now() - inicio });
  return { ok, datos };
}

function mediana(numeros: number[]): number {
  const ordenados = [...numeros].sort((a, b) => a - b);
  return ordenados[Math.floor(ordenados.length / 2)];
}

async function main() {
  // El backend gratuito de Render se duerme: se lo despierta antes y esta llamada no se mide
  console.log('Despertando el backend...');
  await fetch(`${urlBase}/`).catch(() => null);

  const loginAdmin = await llamar('login', 'POST', '/login', undefined, { email: emailAdmin, password: passwordAdmin });
  if (!loginAdmin.ok) {
    console.error('No se pudo iniciar sesión como administrador.');
    process.exit(1);
  }
  const tokenAdmin = loginAdmin.datos.token;

  const tecnicosResp = await llamar('listar técnicos', 'GET', '/tecnicos', tokenAdmin);
  const tecnicos = (tecnicosResp.datos || [])
    .filter((t: any) => t.email.startsWith('piloto-tecnico'))
    .sort((a: any, b: any) => a.email.localeCompare(b.email));

  if (tecnicos.length === 0) {
    console.error('No hay técnicos del piloto cargados.');
    process.exit(1);
  }

  const serviciosResp = await llamar('listar servicios', 'GET', '/servicios', tokenAdmin);
  const delDia = (serviciosResp.datos || []).filter(
    (s: any) => s.fecha_hora.startsWith(fecha) && s.estado === 'pendiente' && !s.tecnico_id && s.cliente_nombre?.startsWith('Cliente Piloto')
  );

  // 1. El administrador asigna: dentro de cada horario, un servicio por técnico (así no hay superposición)
  const porHorario = new Map<string, any[]>();
  for (const servicio of delDia) {
    if (!porHorario.has(servicio.fecha_hora)) porHorario.set(servicio.fecha_hora, []);
    porHorario.get(servicio.fecha_hora)!.push(servicio);
  }

  let asignados = 0;
  for (const grupo of porHorario.values()) {
    for (let i = 0; i < grupo.length; i++) {
      if (i >= tecnicos.length) {
        console.warn(`Hay más servicios simultáneos que técnicos: se omite el servicio ${grupo[i].id}`);
        continue;
      }
      const resultado = await llamar('asignar servicio', 'PATCH', `/servicios/${grupo[i].id}/asignar`, tokenAdmin, {
        tecnico_id: tecnicos[i].id,
        version: grupo[i].version,
      });
      if (resultado.ok) asignados++;
    }
  }

  // 2. Cada técnico lleva sus servicios del día hasta 'finalizado'
  let finalizados = 0;
  for (const tecnico of tecnicos) {
    const loginTecnico = await llamar('login', 'POST', '/login', undefined, {
      email: tecnico.email,
      password: passwordTecnicos,
    });
    if (!loginTecnico.ok) continue;
    const tokenTecnico = loginTecnico.datos.token;

    const misServicios = await llamar('listar mis servicios', 'GET', '/mis-servicios', tokenTecnico);
    const delTecnico = (misServicios.datos || []).filter(
        (s: any) => s.fecha_hora.startsWith(fecha) && s.estado === 'pendiente' && s.cliente_nombre?.startsWith('Cliente Piloto')
    );

    for (const servicio of delTecnico) {
      let version = servicio.version;
      let completo = true;

      for (const estado of ['en_camino', 'en_servicio', 'finalizado']) {
        const resultado = await llamar(`cambiar estado a ${estado}`, 'PATCH', `/servicios/${servicio.id}/estado`, tokenTecnico, { estado, version });
        if (!resultado.ok) {
          completo = false;
          break;
        }
        version = resultado.datos.version;
      }

      if (completo) finalizados++;
    }
  }

  // 3. Resultados
  const exitosas = mediciones.filter((m) => m.ok).length;
  console.log('\n=== Resultados ===');
  console.log(`Servicios del día encontrados (sin asignar al empezar): ${delDia.length}`);
  console.log(`Asignados desde el sistema: ${asignados}`);
  console.log(`Finalizados con el estado actualizado: ${finalizados}`);
  console.log(`Operaciones: ${mediciones.length}, exitosas: ${exitosas} (${Math.round((exitosas / mediciones.length) * 100)}%)`);

  console.log('\nPor operación (cantidad, exitosas, mediana ms, máximo ms):');
  const nombres = [...new Set(mediciones.map((m) => m.operacion))];
  for (const nombre of nombres) {
    const delTipo = mediciones.filter((m) => m.operacion === nombre);
    const tiempos = delTipo.map((m) => m.ms);
    console.log(`- ${nombre}: ${delTipo.length}, ${delTipo.filter((m) => m.ok).length}, ${mediana(tiempos)} ms, ${Math.max(...tiempos)} ms`);
  }
}

main();