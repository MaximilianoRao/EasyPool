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
| 1 | Maxi | 2 min 37 s | 5 | 4 min 17 s | 16 mensajes y 2 llamadas (18 contactos) | Filtro de Excel por técnico, capturas de las celdas filtradas. Conteo: se contaron los «OK» como mensajes. Reprogramar y cancelar: 2 mensajes cada uno (aviso + OK); reasignar: 4 (aviso y OK a cada técnico). Los dos «no realizado» se resolvieron con una llamada cada uno, sin mensajes de respuesta. |
| 2 | Maxi | 2 min 45 s | 6 | 3 min 25 s | 16 mensajes y 2 llamadas (18 contactos) | Igual que la 1, más un filtro extra para ordenar por horario. Un error de asignación obligó a corregirlo y reenviar una captura (5 mensajes + 1 reenvío). Mismo criterio de conteo en los cambios. |

**Resumen del proceso manual (2 corridas, misma persona, respuestas simuladas):**
- Planificación (A): entre 2 min 37 s y 2 min 45 s; 5 a 6 mensajes.
- Gestión de los 8 cambios (B): entre 3 min 25 s y 4 min 17 s; 18 contactos fuera del sistema en ambas.
- Total A + B: entre 6 min 10 s y 6 min 54 s.

Respaldo: capturas del cronómetro en `docs/piloto/capturas/`.


## B.2 Proceso con sistema (una fila por corrida)

| Corrida | Quién | Min planificación (A) | Min gestión de los 8 cambios (B) | Avisos a técnicos recibidos sin contacto externo (de 6) | Segundos hasta ver cada aviso | Avisos al administrador por no realizado (de 2) | Errores 409 u otros | Contactos fuera del sistema | Observaciones |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Maxi | 2 min 24 s | 2 min 54 s | 6 de 6 (verificados después, con sesión de cada técnico afectado) | no medido | 2 de 2 (aparecieron al volver el foco a la pestaña; no se midió el tiempo) | 0 | 0 | Cronómetro A: asignación de los 20 servicios con la regla de la planilla (servicios y 2 puntuales ya cargados antes de empezar). Promedio por servicio: 7,2 s (143,71 s ÷ 20). Cronómetro B: de los cambios 1 a 8; los avisos se verificaron después. OE1: 20 de 20 servicios (consulta SQL). |
| 2 | Maxi | 2 min 28 s | 2 min 08 s | 6 de 6 (verificados después) | no medido | 2 de 2 (aparecieron al volver el foco a la pestaña; no se midió el tiempo). | 0 | 0 | Tras limpiar y volver a cargar los datos. Promedio por servicio: 7,4 s (147,87 s ÷ 20). Con mayor práctica que en la corrida 1. OE1: 20 de 20 servicios. |

Definición del cronómetro B: desde el cambio 1 hasta que el cambio 8 queda registrado en la pantalla del técnico. No incluye la espera de avisos, que se verifican después.

Ventanas usadas: administrador (PC), técnico T2 (PC, incógnito) y técnico T5 (celular).

Respaldo: capturas del cronómetro en `docs/piloto/capturas/`.

## B.3 OE3: técnico en celular (2 tandas de 9 mediciones)

| Tanda | Servicio | Cambio | Segundos | Observación |
|---|---|---|---|---|
| 1 | Cliente Piloto 2 | Pendiente a En camino | 11,72 | |
| 1 | Cliente Piloto 2 | En camino a En servicio | 8,39 | Apareció el cartel de permiso de ubicación del navegador (primer cambio que pide ubicación); incluido en el tiempo |
| 1 | Cliente Piloto 2 | En servicio a Finalizado | 9,22 | |
| 1 | Cliente Piloto 3 | Pendiente a En camino | 8,80 | |
| 1 | Cliente Piloto 3 | En camino a En servicio | 9,81 | |
| 1 | Cliente Piloto 3 | En servicio a Finalizado | 12,94 | Más lenta de la tanda |
| 1 | Cliente Piloto 4 | Pendiente a En camino | 11,96 | |
| 1 | Cliente Piloto 4 | En camino a En servicio | 8,03 | |
| 1 | Cliente Piloto 4 | En servicio a Finalizado | 3,55 | Más rápida de la tanda |
| 2 | Cliente Piloto 2 | Pendiente a En camino | 5,63 | |
| 2 | Cliente Piloto 2 | En camino a En servicio | 4,53 | Permiso de ubicación ya concedido |
| 2 | Cliente Piloto 2 | En servicio a Finalizado | 11,32 | Más lenta de la tanda |
| 2 | Cliente Piloto 3 | Pendiente a En camino | 5,10 | |
| 2 | Cliente Piloto 3 | En camino a En servicio | 5,87 | |
| 2 | Cliente Piloto 3 | En servicio a Finalizado | 7,77 | |
| 2 | Cliente Piloto 4 | Pendiente a En camino | 3,27 | Más rápida de la tanda |
| 2 | Cliente Piloto 4 | En camino a En servicio | 5,12 | |
| 2 | Cliente Piloto 4 | En servicio a Finalizado | 7,35 | |

Método: celular real con T1 y la URL desplegada, con un único cronómetro en marcha continua y una vuelta por cambio (se tocaba el botón y se marcaba la vuelta al verse el estado nuevo en la tarjeta del servicio). No se cerró ni reabrió la pestaña entre cambios, por lo que cada vuelta incluye el breve intervalo entre un cambio y el siguiente y no incluye el tiempo de reabrir la aplicación. Los cambios a "En servicio" y "Finalizado" incluyen la solicitud de ubicación del celular.

Resultado: tanda 1, de 3,55 a 12,94 s (mediana 9,22 s); tanda 2, de 3,27 a 11,32 s (mediana 5,63 s). Las 18 mediciones están por debajo de la meta del documento (menos de 30 s).

Respaldo: capturas de las vueltas en `docs/piloto/capturas/`.

## B.4 OE6

Script `medir-operaciones.ts` contra el backend desplegado, con datos del piloto (18 servicios generados por planes, 5 técnicos). Se despertó el backend antes de medir. Salida completa en `docs/piloto/salida-oe6.txt`.

Operaciones totales: 85. Exitosas: 85 (100%).

El servicio 417 corresponde a Cliente Piloto 5, reprogramado a las 10:21 para esta prueba.

| Operación | Cantidad | Exitosas | Mediana (ms) | Máximo (ms) |
|---|---|---|---|---|
| login | 6 | 6 | 908 | 1887 |
| listar técnicos | 1 | 1 | 378 | 378 |
| listar servicios | 1 | 1 | 553 | 553 |
| asignar servicio | 18 | 18 | 1598 | 1647 |
| listar mis servicios | 5 | 5 | 374 | 380 |
| cambiar estado a en_camino | 18 | 18 | 1077 | 1128 |
| cambiar estado a en_servicio | 18 | 18 | 1074 | 1144 |
| cambiar estado a finalizado | 18 | 18 | 1075 | 1137 |

Prueba sin conexión (celular real, modo avión), servicio 417:

| Paso | Resultado |
|---|---|
| Modo avión + «Marcar en camino» | Mensaje «No hay conexión. Probá de nuevo en unos segundos.»; el estado siguió en «Pendiente» |
| Se restablece la conexión + «Marcar en camino» | El estado pasó a «En camino» |
| `historial_estado` del servicio | 1 solo registro `pendiente → en_camino` (id 169); sin duplicados ni registros del intento fallido |

Resultado: sin pérdida de información ante la falla de conexión. Capturas en `docs/piloto/capturas/oe6-sin-conexion-*.jpeg`.

Alcance de la prueba: se verificó el caso en que la solicitud no llega al servidor. No se probó el caso en que la solicitud llega pero se pierde la respuesta; en ese caso el control de versión del servicio (error 409 al reintentar) evita aplicar el cambio dos veces.


## B.5 Resultados para el documento

| Objetivo | Meta del documento | Resultado (rango de 2 corridas) | Cómo se midió | Conclusión |
|---|---|---|---|---|
| OE1 centralizar | 100% de los servicios registrados | 20 de 20 servicios registrados en ambas corridas (100%) | consulta SQL | Cumple |
| OE2 asignar | al menos 95% asignados desde el sistema; menos de 1 min por servicio | 20 de 20 asignados desde el sistema (100%); 7,2 s y 7,4 s por servicio (143,71 s y 147,87 s para 20 servicios) | pantalla y cronómetro A | Cumple |
| OE3 autonomía del técnico | al menos 90% actualizados; menos de 30 s | 18 de 18 cambios hechos por el técnico desde el celular (100%); de 3,27 a 12,94 s (mediana 9,22 s en la tanda 1 y 5,63 s en la tanda 2) | celular y cronómetro | Cumple |
| OE4 coordinación | al menos 50% menos mensajes | Manual: 23 y 24 contactos fuera del sistema. Sistema: 0 en ambas corridas (100% menos) | conteo en planilla | Cumple |
| OE5 tiempo administrativo | 50% menos de tiempo | Total A + B: 23,2% y 25,6% menos (414,28 → 318,15 s; 370,12 → 275,54 s). Solo planificación: 8,4% y 10,2%. Solo gestión de cambios: 32,2% y 37,9%. Comparación cruzada: entre 14,0% y 33,5% | cronómetros A y B | Cumple parcialmente: la meta de 50% no se alcanza |
| OE6 viabilidad técnica | al menos 95% de operaciones críticas exitosas | 85 de 85 operaciones exitosas (100%); prueba sin conexión sin pérdida ni duplicado de registros | script y prueba sin conexión | Cumple |

Cálculo del ahorro: (manual − sistema) ÷ manual, con los tiempos de las capturas del cronómetro, comparando cada corrida con su par (corrida 1 con corrida 1, corrida 2 con corrida 2).

Limitaciones del piloto:
- Lo hizo una sola persona, con respuestas de técnicos y clientes simuladas.
- Hubo efecto de aprendizaje entre corridas, tanto en el proceso manual como en el sistema.
- La carga inicial de datos no entra en ningún cronómetro.
- El script de OE6 mide la API desde la PC contra el backend gratuito de Render y no envía ubicación en los cambios de estado.
- Los avisos se verificaron después de las corridas y no se midió cuánto tardan en verse; no son en tiempo real.
- Las coordenadas de ubicación se registran, pero no se validaron contra posiciones geográficas reales.