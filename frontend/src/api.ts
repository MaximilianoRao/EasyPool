const API_URL = 'http://localhost:3001';

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

export async function crearServicio(token: string, ubicacionId: number, fechaHora: string) {
  const respuesta = await fetch(`${API_URL}/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ubicacion_id: ubicacionId, fecha_hora: fechaHora }),
  });
  if (!respuesta.ok) throw new Error('No se pudo crear el servicio');
  return respuesta.json();
}

export async function asignarTecnico(token: string, servicioId: number, tecnicoId: number) {
  const respuesta = await fetch(`${API_URL}/servicios/${servicioId}/asignar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tecnico_id: tecnicoId }),
  });
  if (!respuesta.ok) throw new Error('No se pudo asignar el técnico');
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