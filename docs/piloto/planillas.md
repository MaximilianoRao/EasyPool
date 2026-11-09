# Planillas del piloto simulado

Piloto simulado: datos ficticios, todos los roles realizados por la misma persona.
Fecha del día piloto: 2026-11-09

## Escenario: 20 servicios de 60 minutos

| Cliente | Horario | Técnico |
|---|---|---|
| 1 | 08:00 | T1 |
| 2 | 10:00 | T1 |
| 3 | 13:00 | T1 |
| 4 | 15:00 | T1 |
| 5 | 08:00 | T2 |
| 6 | 10:00 | T2 |
| 7 | 13:00 | T2 |
| 8 | 15:00 | T2 |
| 9 | 08:00 | T3 |
| 10 | 10:00 | T3 |
| 11 | 13:00 | T3 |
| 12 | 15:00 | T3 |
| 13 | 08:00 | T4 |
| 14 | 10:00 | T4 |
| 15 | 13:00 | T4 |
| 16 | 15:00 | T4 |
| 17 | 08:00 | T5 |
| 18 | 10:00 | T5 |
| 19 | 13:00 | T5 |
| 20 | 15:00 | T5 |

## Guion de 8 cambios (mismo orden en los dos procesos)

| # | Cambio | Cliente (horario, técnico) | Detalle |
|---|---|---|---|
| 1 | Reprogramar | 1 (08:00, T1) | pasa a las 16:30 del mismo día |
| 2 | Reprogramar | 6 (10:00, T2) | pasa a las 17:30 |
| 3 | Reprogramar | 11 (13:00, T3) | pasa a las 18:30 |
| 4 | Reasignar | 13 (08:00, T4) | pasa a T1 |
| 5 | Reasignar | 15 (13:00, T4) | pasa a T3 |
| 6 | Cancelar | 20 (15:00, T5) | el cliente avisa que no lo necesita |
| 7 | No realizado | 8 (15:00, T2) | el técnico llega y el cliente no está |
| 8 | No realizado | 17 (08:00, T5) | no puede acceder a la piscina |

## B.1 Proceso manual (una fila por corrida)

| Corrida | Quién | Min planificación (A) | Mensajes de planificación | Min gestión de los 8 cambios (B) | Mensajes y llamadas por los cambios | Observaciones |
|---|---|---|---|---|---|---|
| 1 | Maxi | 2 min 37 s | 5 | | | Filtro de Excel por técnico, capturas de las celdas filtradas. |
| 2 | Maxi | 2 min 45 s | 6 | | | Igual que la 1, más un filtro extra para ordenar por horario. Un error de asignación obligó a corregirlo y reenviar una captura (5 mensajes + 1 reenvío). |

Rango del cronómetro A: entre 2:37 y 2:45 min, entre 5 y 6 mensajes.

Respaldo: capturas del cronómetro en `docs/piloto/capturas/`.


## B.1 Proceso manual (una fila por corrida)

| Corrida | Quién | Min planificación (A) | Mensajes de planificación | Min gestión de los 8 cambios (B) | Mensajes y llamadas por los cambios | Observaciones |
|---|---|---|---|---|---|---|
| 1 | Maxi | 2 min 37 s | 5 | 4 min 17 s | 16 mensajes y 2 llamadas (18 contactos) | Filtro de Excel por técnico, capturas de las celdas filtradas. Conteo: se contaron los «OK» como mensajes. Reprogramar y cancelar: 2 mensajes cada uno (aviso + OK); reasignar: 4 (aviso y OK a cada técnico). Los dos «no realizado» se resolvieron con una llamada cada uno, sin mensajes de respuesta. |
| 2 | Maxi | 2 min 45 s | 6 | 3 min 25 s | 16 mensajes y 2 llamadas (18 contactos) | Igual que la 1, más un filtro extra para ordenar por horario. Un error de asignación obligó a corregirlo y reenviar una captura (5 mensajes + 1 reenvío). Mismo criterio de conteo en los cambios. |

**Resumen del proceso manual (2 corridas, misma persona, respuestas simuladas):**
- Planificación (A): entre 2 min 37 s y 2 min 45 s; 5 a 6 mensajes.
- Gestión de los 8 cambios (B): entre 3 min 25 s y 4 min 17 s; 18 contactos fuera del sistema en ambas.
- Total A + B: entre 6 min 10 s y 6 min 54 s.

Respaldo: capturas del cronómetro en `docs/piloto/capturas/`.

## B.3 OE3: técnico en celular (9 filas)

| Servicio | Cambio | Segundos | Observación |
|---|---|---|---|
| | | | |

## B.4 OE6

| Operaciones totales | Exitosas | % | Mediana (ms) | Máximo (ms) | Prueba sin conexión |
|---|---|---|---|---|---|
| | | | | | |

## B.5 Resultados para el documento

| Objetivo | Meta del documento | Resultado (rango de 2 corridas) | Cómo se midió | Conclusión |
|---|---|---|---|---|
| OE1 centralizar | 100% de los servicios registrados | | consulta SQL | |
| OE2 asignar | al menos 95% asignados desde el sistema; menos de 1 min por servicio | | pantalla y cronómetro | |
| OE3 autonomía del técnico | al menos 90% actualizados; menos de 30 s | | celular y cronómetro | |
| OE4 coordinación | al menos 50% menos mensajes | | conteo en planilla | |
| OE5 tiempo administrativo | 50% menos de tiempo | | cronómetro A y B | |
| OE6 viabilidad técnica | al menos 95% de operaciones críticas exitosas | | script y prueba sin conexión | |