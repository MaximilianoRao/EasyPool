import { useState } from 'react';
import { crearCliente, crearUbicacion } from './api';

function AdminPanel({ token, onClienteCreado }: { token: string; onClienteCreado: () => void }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function handleCrearCliente(e: React.FormEvent) {
    e.preventDefault();
    setMensaje('');

    try {
      const cliente = await crearCliente(token, nombre, telefono);
      await crearUbicacion(token, cliente.id, direccion, Number(latitud), Number(longitud));

      setMensaje(`Cliente "${cliente.nombre}" creado con su ubicación.`);
      onClienteCreado();
      setNombre('');
      setTelefono('');
      setDireccion('');
      setLatitud('');
      setLongitud('');
    } catch (err) {
      setMensaje('Ocurrió un error al crear el cliente o la ubicación.');
    }
  }

  return (
    <div>
      <h2>Nuevo Cliente</h2>
      <form onSubmit={handleCrearCliente}>
        <div>
          <label>Nombre: </label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono: </label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <div>
          <label>Dirección: </label>
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div>
          <label>Latitud: </label>
          <input value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
        </div>
        <div>
          <label>Longitud: </label>
          <input value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
        </div>
        <button type="submit">Crear Cliente</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default AdminPanel;