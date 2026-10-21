import { distanciaKm, ordenarPorCercania, distanciaTotalKm, Punto } from '../rutas';

describe('Cálculo de distancias y orden de visitas', () => {
  const cordoba: Punto = { id: 1, latitud: -31.4201, longitud: -64.1888 };
  const buenosAires: Punto = { id: 2, latitud: -34.6037, longitud: -58.3816 };

  // Cuatro puntos en línea recta: el orden cronológico recorre de más
  const s1: Punto = { id: 1, latitud: 0, longitud: 0 };
  const s2: Punto = { id: 2, latitud: 0, longitud: 3 };
  const s3: Punto = { id: 3, latitud: 0, longitud: 1 };
  const s4: Punto = { id: 4, latitud: 0, longitud: 2 };
  const cronologico = [s1, s2, s3, s4];

  it('calcula la distancia aproximada entre Córdoba y Buenos Aires', () => {
    const km = distanciaKm(cordoba, buenosAires);
    expect(km).toBeGreaterThan(640);
    expect(km).toBeLessThan(655);
  });

  it('la distancia de un punto a sí mismo es cero', () => {
    expect(distanciaKm(cordoba, cordoba)).toBe(0);
  });

  it('un grado de latitud equivale a unos 111 km', () => {
    const km = distanciaKm({ id: 1, latitud: 0, longitud: 0 }, { id: 2, latitud: 1, longitud: 0 });
    expect(km).toBeGreaterThan(111);
    expect(km).toBeLessThan(111.4);
  });

  it('mantiene el primer punto y ordena el resto por cercanía', () => {
    const sugerido = ordenarPorCercania(cronologico);
    expect(sugerido.map((p) => p.id)).toEqual([1, 3, 4, 2]);
  });

  it('no modifica el arreglo original', () => {
    ordenarPorCercania(cronologico);
    expect(cronologico.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });

  it('con cero o un punto devuelve lo mismo', () => {
    expect(ordenarPorCercania([])).toEqual([]);
    expect(ordenarPorCercania([s1])).toEqual([s1]);
  });

  it('el orden sugerido recorre menos distancia que el cronológico', () => {
    const sugerido = ordenarPorCercania(cronologico);
    expect(distanciaTotalKm(sugerido)).toBeLessThan(distanciaTotalKm(cronologico));
  });
});