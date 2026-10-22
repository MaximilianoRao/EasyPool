const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function login(email: string, password: string): Promise<{ token: string; rol: string }> {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!respuesta.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  return respuesta.json();
}

export async function obtenerClientes(token: string) {
  const respuesta = await fetch(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los clientes');
  }

  return respuesta.json();
}

export async function crearCliente(token: string, nombre: string, telefono: string) {
  const respuesta = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, telefono }),
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo crear el cliente');
  }

  return respuesta.json();
}

export async function crearUbicacion(
  token: string,
  clienteId: number,
  direccion: string,
  latitud: number,
  longitud: number
) {
  const respuesta = await fetch(`${API_URL}/clientes/${clienteId}/ubicaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ direccion, latitud, longitud }),
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo crear la ubicación');
  }

  return respuesta.json();
}

export async function obtenerUbicaciones(token: string, clienteId: number) {
  const respuesta = await fetch(`${API_URL}/clientes/${clienteId}/ubicaciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener las ubicaciones');
  return respuesta.json();
}

export async function obtenerTecnicos(token: string) {
  const respuesta = await fetch(`${API_URL}/tecnicos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener los técnicos');
  return respuesta.json();
}

export async function crearServicio(token: string, ubicacionId: number, fechaHora: string, duracionMinutos: number) {
  const respuesta = await fetch(`${API_URL}/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ubicacion_id: ubicacionId, fecha_hora: fechaHora, duracion_minutos: duracionMinutos }),
  });
  if (!respuesta.ok) throw new Error('No se pudo crear el servicio');
  return respuesta.json();
}

export async function asignarTecnico(token: string, servicioId: number, tecnicoId: number, version: number) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/asignar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tecnico_id: tecnicoId, version }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo asignar el técnico');
  }

  return respuesta.json();
}

export async function cancelarServicio(token: string, servicioId: number, version: number, motivo: string) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/cancelar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version, motivo }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo cancelar el servicio');
  }

  return respuesta.json();
}

export async function reprogramarServicio(token: string, servicioId: number, version: number, fechaHora: string) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/reprogramar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ version, fecha_hora: fechaHora }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo reprogramar el servicio');
  }

  return respuesta.json();
}

export async function obtenerServicios(token: string) {
  const respuesta = await fetch(`${API_URL}/servicios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener los servicios');
  return respuesta.json();
}


export async function obtenerMisServicios(token: string) {
  const respuesta = await fetch(`${API_URL}/mis-servicios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener tus servicios');
  return respuesta.json();
}

export async function marcarNoRealizado(token: string, servicioId: number, motivo: string, version: number) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado: 'no_realizado', motivo, version }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo marcar el servicio como no realizado');
  }

  return respuesta.json();
}

export async function cambiarEstado(token: string, servicioId: number, estado: string, version: number) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado, version }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo cambiar el estado');
  }

  return respuesta.json();
}


export async function guardarObservaciones(token: string, servicioId: number, observaciones: string) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/observaciones`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ observaciones }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudieron guardar las observaciones');
  }

  return respuesta.json();
}

export async function obtenerPlanes(token: string) {
  const respuesta = await fetch(`${API_URL}/planes-mantenimiento`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener los planes');
  return respuesta.json();
}

export async function crearPlan(
  token: string,
  ubicacionId: number,
  frecuencia: string,
  fechaInicio: string,
  duracionMinutos: number
) {
  const respuesta = await fetch(`${API_URL}/planes-mantenimiento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ubicacion_id: ubicacionId,
      frecuencia,
      fecha_inicio: fechaInicio,
      duracion_minutos: duracionMinutos,
    }),
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo crear el plan');
  }

  return respuesta.json();
}

export async function cambiarEstadoPlan(token: string, planId: number, accion: 'pausar' | 'reactivar') {
  const respuesta = await fetch(`${API_URL}/planes-mantenimiento/${planId}/${accion}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudo actualizar el plan');
  return respuesta.json();
}

export async function generarServicios(token: string) {
  const respuesta = await fetch(`${API_URL}/planes-mantenimiento/generar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron generar los servicios');
  return respuesta.json();
}

export async function obtenerRutaSugerida(token: string, tecnicoId: number, fecha: string) {
  const respuesta = await fetch(`${API_URL}/rutas/sugerida?tecnico_id=${tecnicoId}&fecha=${fecha}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || 'No se pudo calcular la ruta sugerida');
  }

  return respuesta.json();
}

export async function obtenerNotificaciones(token: string) {
  const respuesta = await fetch(`${API_URL}/notificaciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron obtener las notificaciones');
  return respuesta.json();
}

export async function marcarNotificacionesLeidas(token: string) {
  const respuesta = await fetch(`${API_URL}/notificaciones/leidas`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!respuesta.ok) throw new Error('No se pudieron marcar las notificaciones');
  return respuesta.json();
}