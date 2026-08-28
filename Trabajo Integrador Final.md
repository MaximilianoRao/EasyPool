

<div align="center">
<h1>Trabajo Integrador Final</h1>

![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUiaW8Ze4E2_u5-R4ACL18njLr9IiR9NGbm_-qJ8N8-gXz4zM_tJ_0eNWl&s=10)

</div>

<br><br>

**Grupo**: 163

**Integrantes**:

- Tomás José Buforn,
- Maximiliano Rao,
- Eric Suarez Dubs

<br>

---



## Definición Refinada del Problema

El dueño de una empresa de mantenimiento de piscinas que gestiona turnos de limpieza y visitas técnicas enfrenta problemas en la planificación y coordinación de los servicios. Actualmente, la planificacion se realiza manualmente mediante planillas de Excel y la comunicación con el personal de campo se lleva a cabo vía WhatsApp.
Según una estimación del dueño durante la entrevista, informó que se destinan aproximadamente 4 horas diarias a tareas de planificacion y coordinacion administrativa. Asimismo, los cambios de ultimo momento y la necesidad de reorganizar los servicios generan retrabajo adicional. Estos valores serán tomados como estimaciones del entrevistado y no como mediciones objetivas del tiempo empleado, hasta que puedan ser validados mediante un registro sistematico de las tareas y los tiempos involucrados.

Esta desconexión de la información puede generar retrabajo ante cambios de último momento, dificultades para conocer de manera actualizada el estado de los servicios y posibles demoras en la coordinación con los técnicos y la atención al cliente. Estas consecuencias deberán ser validadas mediante la observación y medición del proceso actual. Como hipotesis de solución, una plataforma centralizada podría permitir gestionar la agenda, automatizar la asignación de rutas y registrar el estado de los servicios en una única plataforma accesible desde cualquier dispositivo.

### Identificación de Actores y Necesidades

- Dueño/Administrador: Necesita optimizar los tiempos de planificación, reducir errores de asignación y tener una visión global de la operación diaria.
- Personal de Campo (Técnicos): Necesitan visualizar su ruta actualizada en tiempo real, recibir notificaciones de cambios sin depender de mensajes manuales y poder reportar la finalización de tareas instantáneamente.
- Clientes: Necesitan previsibilidad sobre cuándo será visitado su domicilio y recibir constancia del servicio realizado.

### Análisis del Flujo de Trabajo

- Estado Actual: El dueño revisa pedidos → Carga manualmente en Excel → Diseña la ruta a criterio propio → Envía capturas/mensajes por WhatsApp → Si hay un cambio, debe contactar a cada técnico individualmente y actualizar el Excel.
- Impacto de la Ineficiencia: La información, al estar dispersa en diferentes medios, podría limitar la capacidad de la empresa de aumentar la cantidad de servicios sin incrementar proporcionalmente el esfuerzo administrativo.


### Propuesta de Valor Agregado
La solución propuesta no solo "digitalizaría" el Excel, sino que transformaría el proceso porque:
- Optimización de recorridos: La optimización del orden de los servicios busca reducir los tiempos de traslado y el tiempo entre servicios, así como el consumo de combustible.
- Permite reprogramación dinámica: Si un técnico se demora, el sistema puede recomendar reasignar el servicio a otro técnico y el administrador decide si aceptarlo. Con el sistema utilizado actualmente por la empresa, esta operación podría realizarse con herramientas como Excel o WhatsApp, pero requeriría mayor esfuerzo, tiempo y coordinacion.
- Mejora la experiencia: El técnico trabaja con una herramienta profesional y el dueño recupera tiempo para tareas estratégicas


### Preguntas de Validación
¿Cuánto tiempo se pierde actualmente en "retrabajo" por cambios de turnos? 

> Según lo informado por el dueño durante la entrevista, además de las aproximadamente 4 horas diarias destinadas a la planificación inicial, el retrabajo asociado a cancelaciones, modificaciones, reorganización de servicios y comunicación de cambios mediante WhatsApp suele representar entre 2 y 3 horas adicionales diarias. Estos valores son estimaciones proporcionadas por el entrevistado y no fueron obtenidos mediante una medición sistemática. Por este motivo, serán utilizados como referencia inicial y deberán ser validados mediante un registro del tiempo empleado durante el Sprint 0.

¿Por qué un calendario compartido de Google o Excel online no es suficiente para este caso específico? 

No se parte de la premisa de que herramientas como Excel Online o Google Calendar sean insuficientes en términos generales. De hecho, podrían utilizarse para mejorar parcialmente el proceso actual. La diferencia que se busca evaluar es si una solución específica para la empresa puede integrar en un mismo flujo las operaciones que actualmente se realizan mediante distintas herramientas.

En el proceso actual, la planificación, la comunicación de modificaciones y el seguimiento del estado de los servicios se realizan mediante herramientas separadas. Esto obliga al administrador a mantener y actualizar información en diferentes medios y a comunicar manualmente determinados cambios. Una solución específica podría centralizar estas operaciones y adaptar la interfaz a las necesidades de cada actor. Por ejemplo, el administrador podría gestionar la agenda y las asignaciones desde una única plataforma, mientras que el técnico podría consultar sus servicios y actualizar su estado desde el teléfono sin necesidad de modificar planillas o depender exclusivamente de mensajes.

El valor agregado del desarrollo a medida no se considerará demostrado de antemano. Será una hipótesis a validar durante el proyecto, comparando el proceso actual con el funcionamiento del MVP mediante métricas de tiempo, cantidad de modificaciones comunicadas manualmente, errores de coordinación y adopción por parte de los usuarios.

<br>

---



## Definición del stack tecnológico

- **Frontend: React + TypeScript** para una aplicación web responsiva con los tecnicos utilizandola en el telefono y el dueño de la empresa principalmente en pc. React permite construir una interfaz adaptable a diferentes dispositivos, mientras que TypeScript aporta tipado estático, ayudando a detectar errores durante el desarrollo y facilitando el mantenimiento del código a medida que aumenta la complejidad del sistema.

- **Backend: Node.js + Express + TypeScript** El equipo utilizará TypeScript tanto en frontend como en backend, reduciendo la diversidad tecnológica y facilitando el intercambio de conocimientos y estructuras entre ambas capas. Node.js dispone de un ecosistema adecuado para el desarrollo de APIs HTTP y comunicación en tiempo real, mientras que Express permite construir el backend de manera simple y modular.

- **Base de Datos: PostgreSQL (Relacional)** Al manejar clientes, técnicos, turnos y rutas, los datos tienen una estructura clara y relaciones importantes que requieren integridad transaccional.

- **Despliegue: Contenedores (Docker)** en una PaaS (Plataforma como Servicio). Docker asegura que la aplicación funcione igual en desarrollo y producción, mientras que una PaaS reduce la complejidad operativa inicial.

### Justificación de la elección
La elección se fundamenta en los siguientes pilares:

- Naturaleza del problema: El sistema requiere actualizar la información de los servicios de manera ágil, permitiendo la comunicación entre el personal administrativo y los técnicos. Node.js resulta adecuado para este tipo de aplicaciones web debido a su modelo de ejecución orientado en operaciones de entrada/salida y su capacidad de manejar multiples solicitudes eficazmente.

- Como ya conocemos JavaScript, usarlo tanto en el frontend como en el backend (Node.js) unifica el lenguaje, acelerando la escritura y revisión de código. Esto evita el alto costo de aprendizaje que podría retrasar la solución.

- Simplicidad vs. Complejidad: Se busca evitar la sobreingeniería un stack PERN (PostgreSQL, Express, React, NodeJS) es una solución estándar y madura que puede resolver el problema sin necesidad de recurrir a arquitecturas innecesariamente complejas como microservicios.
  
### Viabilidad y evolución

El sistema será diseñado inicialmente para las necesidades de una empresa de mantenimiento de piscinas de pequeña escala, priorizando la correcta resolución del problema operativo identificado por sobre la capacidad de soportar grandes volúmenes de usuarios.

PostgreSQL permitirá mantener la integridad de los datos relacionados con clientes, técnicos y servicios, mientras que Docker facilitará la reproducción del entorno y el despliegue de la aplicación.

El objetivo del MVP no es resolver escenarios de alta concurrencia ni grandes volúmenes de usuarios, sino comprobar que la solución resuelve adecuadamente el problema operativo de la empresa.

Si posteriormente la cantidad de usuarios o servicios aumentara significativamente, sería necesario analizar métricas de rendimiento y evaluar estrategias específicas de escalamiento. Docker facilitará la reproducción y el despliegue de los componentes, pero su utilización por sí sola no garantiza el escalamiento horizontal del sistema.


### Limitaciones y riesgos

- El equipo no domina especifcamente React y NodeJS por lo que la curva de aprendizaje puede llegar a ser un problema incumpliendo plazos de entrega.

- Madurez de librerías específicas: Para la automatización de rutas, debemos verificar la existencia de paquetes maduros y con mantenimiento activo; de lo contrario, podriamos encontrar errores no documentados

- Conectividad en campo: Una limitación intrínseca de una aplicación web es la dependencia de la conexión a internet de los técnicos para reportar en tiempo real, algo que debemos considerar en el diseño de la solución



<br>

---


## Refinamiento de propuesta y análisis de viabilidad asistida por IA

### Problema principal
La planificación y coordinación de los servicios se realiza mediante Excel y WhatsApp, generando aproximadamente 6–7 horas diarias de trabajo administrativo y retrabajo, además de errores y falta de visibilidad sobre el estado de los servicios.

#### Hipótesis de producto

Si centralizamos la agenda, asignamos servicios a técnicos y permitimos que estos actualicen su estado desde el celular, entonces se podría reducir significativamente el tiempo administrativo y los errores de coordinación sin aumentar la carga operativa.

### Objetivo general

Desarrollar y validar un MVP de gestión operativa que permita centralizar la agenda de servicios, asignar trabajos a técnicos y registrar su estado desde dispositivos móviles, con el objetivo de reducir en al menos un 50% el tiempo diario dedicado a planificación y coordinación manual durante una prueba piloto.

### Objetivos específicos

**OE1 — Centralizar la agenda**

Permitir que el administrador cree, modifique, cancele y consulte servicios desde una única plataforma.

<u>Métrica:</u>

- 100% de los servicios del piloto registrados en el sistema.
- Eliminar la necesidad de mantener una agenda paralela en Excel durante la prueba.

**OE2 — Digitalizar la asignación**

Permitir asignar cada servicio a un técnico y visualizar su agenda diaria.

<u>Métrica:</u>

- ≥95% de los servicios asignados mediante el sistema.
- Tiempo de asignación inferior a 1 minuto por servicio en condiciones normales.

**OE3 — Dar autonomía al técnico**

Permitir que el técnico consulte desde el teléfono sus servicios y actualice estados.

Estados iniciales:

Pendiente → En camino → En servicio → Finalizado

<u>Métrica:</u>

- ≥90% de los servicios finalizados tienen su estado actualizado.
- El técnico puede completar la actualización en menos de 30 segundos.

**OE4 — Reducir la coordinación manual**

Reducir la dependencia de WhatsApp para comunicar modificaciones operativas.

<u>Métrica:</u>

- Reducir al menos 50% los mensajes manuales relacionados con cambios de agenda durante el piloto.


**OE5 — Reducir tiempo administrativo**

Reducir las aproximadamente 6–7 horas diarias actualmente utilizadas en planificación y retrabajo.

<u>Métrica:</u>

- Objetivo inicial: ≤3 horas/día.
- Objetivo posterior: ≤2 horas/día.

**OE6 — Validar la viabilidad técnica**

Comprobar que la aplicación funciona correctamente en computadoras y teléfonos y que puede utilizarse con conectividad móvil habitual.

<u>Métrica:</u>

- ≥95% de operaciones críticas exitosas.
- Sin pérdida de información ante errores normales de conexión.
- Tiempo de respuesta percibido aceptable para las operaciones principales.

### Alcance del MVP

**Incluye**

**Administrador**
- Login.
- Gestión de clientes.
- Gestión de técnicos.
- Alta/modificación/cancelación de servicios.
- Agenda diaria/semanal.
- Asignación de técnico.
- Visualización del estado de los servicios.
- Modificación de asignaciones.
- Visualización de ubicación del servicio.

**Técnico**

Desde celular:
* Login.
* Ver servicios del día.
* Ver información del cliente.
* Ver ubicación.
* Cambiar estado:
  - Pendiente
  - En camino
  - En servicio
  - Finalizado
* Registrar observación.
* Registrar evidencia básica del servicio, si es necesaria.

**Sistema**
- Base de datos centralizada.
- Actualización de estados en tiempo casi real.
- Registro histórico de servicios.
- Notificación básica ante cambios.
- Registro de fecha/hora de las operaciones.

**Rutas**

- Optimización dinámica de ruta diaria y reasignación automática.
El sistema propone un orden optimizado considerando ubicación y reasignar técnicos mas cercanos a la ubicación de los servicios. El administrador puede aceptarlo o modificarlo.

**GPS**
- Ubicacion de llegada.
- Ubicacion de finalización.

**No incluye**
- Reasignación automática
- IA predictiva
- App nativa Android/iOS
- Facturación
- Pagos online
- Chat interno
- Integración WhatsApp compleja


### Entregables por etapa
---
**Sprint 0 — Descubrimiento**

Duración: 1 semana

Entregables:

- mapa del proceso actual;
- definición de métricas;
- backlog priorizado;
- modelo de dominio;
- arquitectura inicial;
- definición de MVP.

Evidencia

Un documento donde puedan responder:

¿Qué problema estamos resolviendo y cómo vamos a saber si lo resolvimos?

---
**Sprint 1 — Fundaciones**

Semana 2 y 3

Tareas:

- repositorio;
- estructura del proyecto;
- Docker;
- PostgreSQL;
- autenticación;
- usuarios/roles;
- modelo de datos;
- API base;
- CI/CD básico.
- Entregable

API funcional + base de datos + login.

---

**Sprint 2 — Agenda**

Semana 4 y 5

Implementar:

- clientes;
- técnicos;
- servicios;
- agenda;
- asignación;
- estados.
- Entregable

El administrador puede realizar:

```
Crear cliente
     ↓
Crear servicio
     ↓
Asignar técnico
     ↓
Ver agenda
     ↓
Modificar servicio
```
---
**Sprint 3 — Portal web del técnico**

Semana 6 y 7

Implementar interfaz web responsiva para uso desde teléfonos móviles:

- login;
- agenda del día;
- detalle del servicio;
- visualización de ubicación;
- cambio de estado;
- registro de observaciones;
- finalización del servicio.

Entregable

Un técnico real puede realizar un servicio completo utilizando la aplicación web desde un teléfono móvil.

---
**Sprint 4 — Rutas y notificaciones**

Semana 8 y 9

Implementar:

- ordenamiento de servicios;
- integración con mapas;
- cálculo básico de ruta;
- notificación de cambios;
- actualización en tiempo real.

Entregable

Demo completa:

```
Administrador cambia servicio
          ↓
Sistema actualiza agenda
          ↓
Técnico recibe cambio
          ↓
Técnico modifica estado
          ↓
Administrador lo ve
```
---
**Sprint 5 — Piloto**

Semana 10 y 11

No dedicaría esta semana a agregar funcionalidades.

La dedicaría a:

- pruebas;
- corrección de errores;
- capacitación;
- medición de tiempos;
- recopilación de feedback.

Entregable principal

MVP utilizado en condiciones reales.

---

### Riesgos iniciales


**Riesgo 1 — Curva de aprendizaje React/Node**

**Probabilidad**: Alta <br>
**Impacto**: Alto

<u>Mitigación</u>

Reducir stack y utilizar:
- React;
- TypeScript;
- Express;
- PostgreSQL;
- una librería UI madura.

**Riesgo 2 — Sobreingeniería**

**Probabilidad**: Alta <br>
**Impacto**: Alto

El equipo puede terminar desarrollando:

- GPS;
- IA;
- WhatsApp;
- rutas dinámicas;
- app móvil;
- dashboard;
- pagos;
- facturación;

antes de validar si el problema principal realmente se soluciona.

<u>Mitigación</u>

Utilizar una regla:

>Toda funcionalidad debe estar vinculada a una hipótesis y una métrica.

**Riesgo 3 - Rutas**

Este es uno de los mayores riesgos técnicos.

No asumiría que:

>“el algoritmo encuentra la ruta óptima”

significa que encuentra la ruta óptima para esta empresa.

La función objetivo podría ser:

>minimizar distancia

pero la empresa quizás necesita:
```
minimizar tiempo
+
respetar horarios
+
respetar capacidad del técnico
+
respetar zonas
+
respetar duración del servicio
```

Por eso empezaría con ruteo simple.

**Riesgo 4 - De adopción**

Este es probablemente más peligroso que el tecnológico.

El técnico puede pensar:

>“Con WhatsApp ya me arreglo.”

Si el sistema requiere más trabajo que WhatsApp, fracasó.

Por eso una acción como:

>cambiar estado → guardar → volver atrás

debería ser extremadamente rápida.

El técnico no debería tener que completar formularios enormes.

### Criterios de éxito del MVP

#### Operativos
- ≥90% de los servicios del piloto gestionados desde el sistema.
- ≥90% de los servicios tienen estado actualizado.
- ≥80% de los técnicos utilizan el sistema sin asistencia permanente.

#### Tiempo
- Reducir ≥50% las horas diarias destinadas a planificación y coordinación.

#### Errores
- ≥50% menos incidencias de coordinación respecto al baseline.

#### Usabilidad
- ≥80% de los usuarios piloto consideran que el sistema es más fácil que el proceso actual

#### Criterio de éxito más importante

> El producto funciona

Lo que implica que:

```
El dueño ahorra tiempo
↓
El técnico adopta el sistema
↓
Hay menos errores
↓
La empresa puede atender más servicios
```

