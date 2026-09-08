const API_URL = 'http://localhost:3000';

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