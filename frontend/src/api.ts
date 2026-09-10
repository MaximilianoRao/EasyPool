const API_URL = 'http://localhost:3001';

export async function login(email: string, password: string): Promise<string> {
  const respuesta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!respuesta.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const datos = await respuesta.json();
  return datos.token;
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