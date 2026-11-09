export type UbicacionRegistrada = {
  latitud: number
  longitud: number
  precision?: number
}

// Pide la ubicación una sola vez. Si no hay permiso, no hay GPS o se pasa el tiempo, devuelve null.
export function obtenerUbicacion(tiempoMaxMs = 8000): Promise<UbicacionRegistrada | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          // el backend rechaza precisión <= 0, así que no la mandamos en ese caso
          precision: pos.coords.accuracy > 0 ? pos.coords.accuracy : undefined,
        }),
      (err) => {
        console.warn('Geolocalización falló. Código:', err.code, '-', err.message)
        resolve(null)
      },
      { enableHighAccuracy: true, timeout: tiempoMaxMs, maximumAge: 0 }
    )
  })
}