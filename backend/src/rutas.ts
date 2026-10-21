export interface Punto {
  id: number;
  latitud: number;
  longitud: number;
}

const RADIO_TIERRA_KM = 6371;

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

// Fórmula de Haversine: distancia en línea recta entre dos coordenadas, en km
export function distanciaKm(a: Punto, b: Punto): number {
  const dLat = aRadianes(b.latitud - a.latitud);
  const dLon = aRadianes(b.longitud - a.longitud);

  const h =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.pow(Math.sin(dLon / 2), 2);

  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h));
}

// Vecino más cercano: el primer punto queda fijo y en cada paso se va al punto más cercano que falta visitar
export function ordenarPorCercania(puntos: Punto[]): Punto[] {
  if (puntos.length <= 1) return [...puntos];

  const pendientes = puntos.slice(1);
  const orden = [puntos[0]];

  while (pendientes.length > 0) {
    const actual = orden[orden.length - 1];

    let indiceMasCercano = 0;
    for (let i = 1; i < pendientes.length; i++) {
      if (distanciaKm(actual, pendientes[i]) < distanciaKm(actual, pendientes[indiceMasCercano])) {
        indiceMasCercano = i;
      }
    }

    orden.push(pendientes[indiceMasCercano]);
    pendientes.splice(indiceMasCercano, 1);
  }

  return orden;
}

export function distanciaTotalKm(puntos: Punto[]): number {
  let total = 0;
  for (let i = 0; i < puntos.length - 1; i++) {
    total += distanciaKm(puntos[i], puntos[i + 1]);
  }
  return total;
}