# Trabajo Integrador Final — EasyPool

**Grupo:** 163

**Integrantes:**

* Tomás José Buforn
* Maximiliano Rao
* Eric Suarez Dubs

**Tutor:** Oscar Londero

---

# 1. Definición del problema

## 1.1 Problema identificado

La empresa de mantenimiento de piscinas gestiona actualmente la planificación y coordinación de sus servicios mediante una combinación de planillas de Excel y comunicación con el personal de campo principalmente a través de WhatsApp.

El proceso actual requiere que el responsable de la empresa registre y organice los servicios, determine las asignaciones de los técnicos, comunique los cambios y actualice la planificación cuando se producen modificaciones.

Según lo informado por el propietario durante la entrevista, la planificación y coordinación administrativa demanda aproximadamente **4 horas diarias**, mientras que el retrabajo producido por cambios, cancelaciones, reorganización de servicios y comunicación de modificaciones puede demandar aproximadamente **2 a 3 horas adicionales por día**.

Estos valores deben considerarse **estimaciones proporcionadas por el entrevistado y no mediciones objetivas**. Para obtener un baseline verificable se propone registrar durante un período previo al uso del sistema el tiempo efectivamente dedicado a planificación, coordinación y retrabajo.

Por lo tanto, el problema actualmente validado consiste en la existencia de un proceso de planificación y coordinación que depende de información distribuida entre diferentes herramientas y requiere una cantidad significativa de intervención manual.

### Hipótesis

Se plantea como hipótesis que la utilización de una plataforma centralizada podría reducir el tiempo dedicado a estas tareas y disminuir los problemas de coordinación, al permitir gestionar los servicios, las asignaciones y sus estados desde un único sistema.

Esta hipótesis deberá ser validada mediante el uso del MVP y la comparación entre un período baseline y un período de prueba.

---

# 2. Alcance del problema

El problema no se define como una imposibilidad de realizar las tareas actuales.

Las operaciones actualmente pueden realizarse mediante Excel, WhatsApp, teléfono u otras herramientas. Sin embargo, la utilización de estas herramientas requiere coordinación manual y puede generar mayor esfuerzo cuando se producen cambios en la planificación.

Por lo tanto, se considera que el proceso actual **podría limitar potencialmente la capacidad de aumentar la cantidad de servicios sin incrementar proporcionalmente el esfuerzo administrativo**.

No se afirma en esta etapa que el proceso actual impida el crecimiento de la empresa, ya que esa afirmación requeriría evidencia específica.

---

# 3. Actores y necesidades

## 3.1 Administrador / propietario

Necesita:

* gestionar los clientes;
* registrar los servicios;
* asignar técnicos;
* consultar la agenda;
* modificar servicios;
* conocer el estado actualizado de los trabajos;
* reducir el esfuerzo dedicado a coordinación manual;
* mantener un historial de los servicios realizados.

## 3.2 Técnicos

Necesitan:

* consultar rápidamente sus servicios del día;
* conocer la información necesaria para realizar cada trabajo;
* acceder a la ubicación del servicio;
* recibir información actualizada sobre modificaciones;
* informar el estado del servicio de manera rápida;
* registrar observaciones;
* registrar la finalización del trabajo.

El sistema debe priorizar una interacción sencilla desde teléfonos móviles, evitando formularios innecesariamente extensos.

## 3.3 Clientes

El cliente es considerado un **stakeholder**, pero no será necesariamente un usuario directo del MVP.

El valor para el cliente se obtendrá principalmente mediante una mejor organización interna de la empresa, que permitirá al administrador y a los técnicos contar con información actualizada sobre los servicios.

La comunicación directa con el cliente mediante una aplicación, portal propio o sistema de notificaciones al cliente queda **fuera del alcance del MVP**, salvo que durante la validación con la empresa se determine que resulta indispensable.

---

# 4. Flujo de trabajo actual

## 4.1 Proceso actual

El flujo identificado es:

```text
Recepción de servicios
        ↓
Registro en Excel
        ↓
Planificación de los servicios
        ↓
Asignación de técnicos
        ↓
Comunicación mediante WhatsApp
        ↓
Realización del servicio
        ↓
Comunicación del estado o finalización
        ↓
Actualización de la planificación
```

Cuando se produce una modificación:

```text
Cambio / cancelación / demora
        ↓
Reorganización manual
        ↓
Actualización de Excel
        ↓
Comunicación individual con técnicos
        ↓
Confirmación del cambio
```

El principal problema identificado es que la información operativa se encuentra distribuida entre distintas herramientas y requiere intervención manual para mantenerla coordinada.

---

# 5. Datos, estimaciones e hipótesis

Para evitar confundir información validada con supuestos del equipo, se utilizará la siguiente clasificación.

| Información                                               | Estado                 | Origen                                       |
| --------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| Aproximadamente 4 horas diarias de planificación          | Estimación             | Información proporcionada por el propietario |
| Aproximadamente 2–3 horas diarias de retrabajo            | Estimación             | Información proporcionada por el propietario |
| El proceso actual utiliza Excel y WhatsApp                | Dato relevado          | Entrevista / descripción del proceso         |
| La centralización podría reducir el tiempo administrativo | Hipótesis              | Equipo                                       |
| La centralización podría reducir errores de coordinación  | Hipótesis              | Equipo                                       |
| Reducción del 50 % del tiempo administrativo              | Objetivo de validación | Equipo                                       |
| Cantidad de técnicos                                      | Por confirmar          | Empresa                                      |
| Cantidad de servicios diarios                             | Por confirmar          | Empresa                                      |
| Cantidad de usuarios simultáneos                          | Por confirmar          | Equipo / empresa                             |
| Realización del piloto en condiciones reales              | Por confirmar          | Empresa                                      |

Las métricas definitivas serán ajustadas luego de obtener el baseline correspondiente.

---

# 6. Propuesta de valor

EasyPool propone centralizar en una única plataforma la gestión de clientes, servicios, asignaciones y estados.

El objetivo no es simplemente reemplazar una planilla de Excel por una interfaz web, sino reducir parte de la coordinación manual que actualmente se realiza entre distintas herramientas.

El valor esperado del MVP se concentra en:

* centralizar la información de los servicios;
* reducir la duplicación de información;
* facilitar la asignación de técnicos;
* permitir que los técnicos consulten su agenda desde el teléfono;
* permitir actualizar rápidamente el estado de los servicios;
* mantener un historial de las operaciones;
* facilitar la reorganización de servicios desde una única plataforma.

La propuesta no depende de funcionalidades avanzadas como inteligencia artificial, seguimiento GPS continuo o reasignación automática para demostrar su valor inicial.

---

# 7. Comparación con herramientas existentes

## 7.1 Excel Online y Google Calendar

No se considera que Excel Online, Google Calendar o WhatsApp sean herramientas inútiles.

De hecho, podrían adaptarse mediante configuraciones, automatizaciones o integraciones.

La pregunta que se busca responder es qué limitaciones presentan cuando se aplican específicamente al proceso de esta empresa.

Las principales limitaciones identificadas son:

### Excel / Excel Online

Puede utilizarse para registrar servicios y asignaciones, pero requiere que el responsable mantenga manualmente la información actualizada.

Además, una planilla general no representa necesariamente de manera sencilla:

* estados de cada servicio;
* historial de modificaciones;
* usuarios y roles;
* acciones realizadas por los técnicos;
* flujo de estados;
* registro de fecha y hora de cada operación.

### Google Calendar

Puede resultar útil para organizar turnos, pero el calendario no está específicamente diseñado para representar el flujo completo de un servicio de mantenimiento.

Por ejemplo, EasyPool busca manejar:

```text
Servicio
    ↓
Técnico asignado
    ↓
Pendiente
    ↓
En camino
    ↓
En servicio
    ↓
Finalizado
```

### WhatsApp

WhatsApp permite una comunicación rápida, pero no funciona como fuente estructurada de información operativa.

Cuando se modifica un servicio, el responsable debe comunicar el cambio y los técnicos deben interpretar la información recibida.

La plataforma propuesta busca que la información operativa quede registrada en el sistema y que los cambios se reflejen sobre la agenda correspondiente.

Por lo tanto, el valor agregado de EasyPool no se fundamenta en que las herramientas existentes sean incapaces de realizar estas tareas, sino en que una solución específica puede integrar en un mismo flujo las operaciones que actualmente se encuentran distribuidas.

---

# 8. Objetivo general

Desarrollar y validar un MVP de gestión operativa que permita centralizar la agenda de servicios, gestionar clientes, asignar trabajos a técnicos y registrar el estado de los servicios desde dispositivos móviles, evaluando si el sistema permite reducir el tiempo dedicado a planificación y coordinación manual durante una prueba piloto.

Como objetivo inicial de validación se propone evaluar una reducción de **hasta un 50 %** respecto del baseline obtenido antes de utilizar el sistema.

Este porcentaje constituye un **criterio de éxito del proyecto y no un dato actualmente demostrado**.

---

# 9. Objetivos específicos

## OE1 — Centralizar la agenda

Permitir que el administrador pueda crear, modificar, cancelar y consultar servicios desde una única plataforma.

### Métrica

Durante el piloto se medirá:

* cantidad de servicios registrados en EasyPool;
* cantidad total de servicios realizados durante el período.

El objetivo será que **al menos el 90 % de los servicios del período piloto se encuentren registrados en EasyPool**.

El 90 % es un criterio de validación propuesto por el equipo y podrá ajustarse según el tamaño real del piloto.

---

## OE2 — Digitalizar la asignación

Permitir asignar cada servicio a un técnico y visualizar su agenda.

### Métrica

Se registrará:

* cantidad de servicios asignados desde EasyPool;
* cantidad total de servicios.

Objetivo:

**Al menos el 90 % de los servicios del piloto deberán contar con una asignación registrada en el sistema.**

También se medirá el tiempo necesario para realizar una asignación.

El objetivo de **menos de 1 minuto por asignación** será utilizado como referencia inicial y deberá validarse mediante pruebas.

---

# 10. OE3 — Dar autonomía al técnico

Permitir que el técnico consulte desde el teléfono los servicios asignados y actualice su estado.

Los estados serán:

```text
Pendiente
    ↓
En camino
    ↓
En servicio
    ↓
Finalizado
```

### Métrica

Se registrará la cantidad de servicios finalizados cuyo estado haya sido actualizado correctamente.

Objetivo:

**Al menos el 90 % de los servicios finalizados durante el piloto deberán tener su estado actualizado en EasyPool.**

También se medirá el tiempo necesario para realizar el cambio de estado.

Como referencia inicial se establece un objetivo de **menos de 30 segundos**, sujeto a validación durante las pruebas de usabilidad.

---

# 11. OE4 — Reducir la coordinación manual

El objetivo es reducir la necesidad de comunicar manualmente modificaciones operativas mediante WhatsApp.

### Métrica

Durante el período baseline se registrará la cantidad de comunicaciones manuales relacionadas con cambios de agenda.

Durante el piloto se registrará la misma información.

Se compararán ambos períodos.

Objetivo:

**Reducir en al menos un 50 % las comunicaciones manuales relacionadas específicamente con modificaciones de agenda.**

No se contabilizarán todos los mensajes de WhatsApp de la empresa, sino únicamente aquellos relacionados con la coordinación de los servicios.

---

# 12. OE5 — Reducir el tiempo administrativo

El objetivo es evaluar si EasyPool reduce el tiempo dedicado a planificación, coordinación y retrabajo.

Actualmente se dispone de una estimación del propietario de:

* aproximadamente 4 horas diarias de planificación;
* aproximadamente 2–3 horas diarias de retrabajo.

Estos valores no serán utilizados como baseline definitivo.

## Método de medición

Antes del piloto se registrará durante un período determinado:

* hora de inicio de planificación;
* hora de finalización;
* tiempo dedicado a modificaciones;
* tiempo dedicado a comunicación de cambios;
* tiempo dedicado a reorganización.

Luego se realizará la misma medición durante el piloto.

### Métrica

```text
Reducción (%) =
(Tiempo baseline - Tiempo piloto)
---------------------------------- × 100
        Tiempo baseline
```

### Criterio de éxito

Como objetivo inicial:

**Reducir al menos un 50 % el tiempo dedicado a estas actividades respecto del baseline.**

---

# 13. OE6 — Validar la viabilidad técnica

Comprobar que la aplicación puede utilizarse correctamente desde computadora y teléfono móvil con una conexión habitual.

### Métricas

Se registrará:

* cantidad de operaciones críticas realizadas correctamente;
* cantidad de errores;
* cantidad de operaciones que requieren repetición;
* pérdida de información provocada por errores de conexión.

Como criterio inicial:

**Al menos el 95 % de las operaciones críticas realizadas durante las pruebas deberán completarse correctamente.**

Este porcentaje se considera un criterio técnico de aceptación y deberá evaluarse sobre una cantidad concreta de pruebas.

---

# 14. Baseline

Para evitar métricas sin punto de comparación, se establecerá un baseline antes del piloto.

Durante el período baseline se registrarán:

| Variable                   | Método de medición                               |
| -------------------------- | ------------------------------------------------ |
| Tiempo de planificación    | Registro manual de inicio y finalización         |
| Tiempo de retrabajo        | Registro de cada tarea y duración                |
| Cambios de agenda          | Conteo de modificaciones                         |
| Comunicaciones por cambios | Conteo de mensajes relacionados con coordinación |
| Servicios diarios          | Cantidad de servicios registrados                |
| Errores de coordinación    | Registro de incidencias                          |

Posteriormente se repetirá la medición durante el piloto.

Esto permitirá comparar el funcionamiento del proceso antes y después de utilizar EasyPool.

---

# 15. Alcance del MVP

## 15.1 Administrador

El MVP permitirá:

* iniciar sesión;
* gestionar clientes;
* gestionar técnicos;
* crear servicios;
* modificar servicios;
* cancelar servicios;
* consultar agenda diaria;
* consultar agenda semanal;
* asignar técnicos;
* modificar asignaciones;
* consultar el estado de los servicios;
* consultar la ubicación del servicio;
* consultar el historial básico de servicios.

---

# 16. Portal del técnico

El técnico podrá utilizar una interfaz web responsiva desde su teléfono.

Permitirá:

* iniciar sesión;
* consultar sus servicios del día;
* consultar información del cliente necesaria para realizar el servicio;
* consultar la ubicación del servicio;
* cambiar el estado del servicio;
* registrar una observación;
* registrar la finalización del servicio.

La interacción se diseñará priorizando rapidez y simplicidad.

---

# 17. Estados de los servicios

Los estados iniciales serán:

```text
PENDIENTE
   ↓
EN CAMINO
   ↓
EN SERVICIO
   ↓
FINALIZADO
```

El sistema registrará la fecha y hora correspondiente a los cambios de estado.

No se incorporará seguimiento continuo de la ubicación del técnico.

Esto mantiene coherencia entre el problema definido y el alcance real del MVP.

---

# 18. Rutas

## 18.1 Definición concreta

En nuestro MVP, **optimizar una ruta significa determinar un orden conveniente para realizar los servicios asignados a un técnico durante una jornada, utilizando la distancia entre las ubicaciones de los servicios como criterio principal.**

El MVP no intentará resolver un problema completo de optimización logística.

Inicialmente se contemplará:

* un técnico;
* múltiples servicios;
* una ubicación conocida para cada servicio;
* cálculo de distancias;
* generación de un orden sugerido de visita.

No se contemplará inicialmente:

* optimización global de toda la flota;
* reasignación automática de técnicos;
* reoptimización automática en tiempo real;
* predicción de tráfico;
* ventanas horarias complejas;
* optimización considerando múltiples restricciones simultáneamente.

---

# 19. Estrategia inicial de ruteo

Para reducir la dependencia de servicios externos y mantener el problema dentro del alcance del proyecto, inicialmente se evaluará utilizar una cantidad limitada de ubicaciones geográficas representativas.

Por ejemplo, se podrá definir una tabla de localidades o puntos de servicio con:

```text
ID
Localidad
Latitud
Longitud
```

A partir de estas coordenadas se podrá calcular la distancia entre los puntos.

El equipo evaluará posteriormente el algoritmo concreto que se utilizará para generar el orden sugerido.

Una primera alternativa será utilizar una estrategia de selección del siguiente punto según distancia, debido a su menor complejidad de implementación.

El objetivo del MVP no será demostrar que se obtiene la ruta matemáticamente óptima, sino comprobar si un ordenamiento basado en distancia puede aportar valor operativo.

---

# 20. Uso de servicios externos de mapas

La primera versión del MVP buscará evitar una dependencia obligatoria de APIs externas de mapas para el cálculo básico de distancias.

Si posteriormente se incorpora un servicio externo de mapas o ruteo, se deberá documentar:

* proveedor utilizado;
* API utilizada;
* límites de uso;
* necesidad de una clave;
* posibles costos;
* dependencia de conexión a Internet;
* tratamiento de los datos de ubicación.

La incorporación de un servicio externo no se considerará necesaria para validar inicialmente la hipótesis básica del ruteo.

---

# 21. GPS y ubicación

Se diferenciará entre **seguimiento continuo** y **registro puntual de ubicación**.

El MVP no realizará seguimiento GPS continuo del técnico.

Se podrá registrar, si resulta técnicamente viable y se valida con la empresa:

* ubicación de llegada;
* ubicación de finalización.

Estas ubicaciones serán registros puntuales asociados al servicio.

El registro de ubicación deberá requerir el permiso correspondiente del dispositivo.

El acceso a las coordenadas quedará restringido a los usuarios autorizados del sistema y deberá evitarse almacenar información de ubicación que no resulte necesaria para el funcionamiento del servicio.

---

# 22. Evidencia del servicio

Para evitar ambigüedad, la primera versión del MVP definirá la evidencia como:

**una observación textual registrada por el técnico al finalizar el servicio.**

El almacenamiento de fotografías queda fuera del MVP inicial.

Si durante la validación la empresa considera indispensable utilizar fotografías como evidencia, esta funcionalidad podrá evaluarse posteriormente teniendo en cuenta:

* almacenamiento;
* permisos;
* privacidad;
* acceso;
* seguridad;
* protección de información de clientes.

---

# 23. Notificaciones

El MVP contará inicialmente con una notificación básica asociada a modificaciones de servicios dentro del sistema.

Cuando el administrador modifique una asignación o información relevante del servicio, el técnico podrá visualizar el cambio al consultar o actualizar su agenda.

No se desarrollará una integración compleja con WhatsApp.

El sistema no dependerá de WhatsApp para mantener la información operativa.

---

# 24. Rol del cliente

El cliente será considerado un stakeholder pero no un usuario directo del MVP.

La aplicación estará orientada inicialmente al administrador y a los técnicos.

El cliente recibirá el beneficio de forma indirecta mediante una mejor organización de los servicios.

Las siguientes funcionalidades quedan fuera del MVP:

* aplicación para clientes;
* login de clientes;
* portal de clientes;
* notificaciones directas al cliente;
* seguimiento del técnico por parte del cliente.

Podrán ser consideradas en una etapa posterior si la validación demuestra que aportan valor suficiente.

---

# 25. Stack tecnológico

## Frontend

**React + TypeScript**

Se propone utilizar React para desarrollar una interfaz web responsiva que pueda ser utilizada tanto desde computadoras como desde teléfonos móviles.

TypeScript permitirá utilizar tipado estático y compartir un lenguaje entre frontend y backend.

Sin embargo, se reconoce que conocer JavaScript no implica dominar React ni TypeScript.

Por este motivo, la elección deberá evaluarse en función de la experiencia real del equipo.

---

# 26. Backend

**Node.js + Express + TypeScript**

Node.js y Express permitirán desarrollar una API HTTP para gestionar:

* usuarios;
* clientes;
* técnicos;
* servicios;
* estados;
* asignaciones;
* rutas.

La elección no se fundamenta en la necesidad de soportar alta concurrencia, ya que actualmente no se dispone de evidencia que indique que esta sea una necesidad del proyecto.

La principal justificación será mantener una tecnología coherente con el frontend y evitar incorporar innecesariamente múltiples lenguajes.

---

# 27. Base de datos

**PostgreSQL**

Se utilizará una base de datos relacional debido a que el sistema manejará entidades relacionadas como:

```text
Clientes
    ↓
Servicios
    ↓
Técnicos
    ↓
Asignaciones
    ↓
Estados
```

La estructura relacional permitirá mantener integridad entre estas entidades.

---

# 28. Docker

Docker será utilizado principalmente para:

* reproducir el entorno de desarrollo;
* facilitar la configuración del proyecto;
* aislar los servicios;
* reducir diferencias entre entornos.

No se considera que Docker, por sí mismo, proporcione escalabilidad horizontal.

La escalabilidad a grandes volúmenes de usuarios queda fuera del objetivo del MVP.

---

# 29. Escala esperada

Antes de realizar decisiones arquitectónicas relacionadas con concurrencia se deberá relevar:

* **Cantidad de técnicos:** [COMPLETAR]
* **Cantidad aproximada de servicios diarios:** [COMPLETAR]
* **Cantidad de administradores:** [COMPLETAR]
* **Cantidad estimada de usuarios simultáneos:** [COMPLETAR]

Con estos datos se determinará si existe realmente un requerimiento significativo de concurrencia.

La arquitectura inicial será dimensionada para las necesidades reales de la empresa y no para un escenario hipotético de miles de usuarios.

---

# 30. Experiencia tecnológica del equipo

La elección del stack también se evaluará según la experiencia real de los integrantes.

| Tecnología | Tomás       | Maximiliano | Eric        |
| ---------- | ----------- | ----------- | ----------- |
| JavaScript | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| TypeScript | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| React      | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Node.js    | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Express    | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| PostgreSQL | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Docker     | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |

La elección definitiva del stack se considerará viable si el equipo puede justificar que posee conocimientos suficientes o un plan concreto para adquirir los conocimientos faltantes dentro del tiempo disponible.

---

# 31. Riesgos

## Riesgo 1 — Curva de aprendizaje

**Probabilidad:** Alta
**Impacto:** Alto

El equipo no domina necesariamente todas las tecnologías propuestas.

El riesgo no se solucionará simplemente utilizando React y Express.

### Mitigación

* distribuir responsabilidades según experiencia;
* realizar pequeños prototipos antes del desarrollo completo;
* limitar la cantidad de tecnologías;
* utilizar documentación oficial;
* priorizar funcionalidades del MVP;
* registrar problemas técnicos y tiempo de aprendizaje.

Si el relevamiento de experiencia demuestra que el stack elegido resulta inviable dentro del plazo, se reconsiderará la elección tecnológica.

---

# 32. Riesgo 2 — Sobreingeniería

**Probabilidad:** Alta
**Impacto:** Alto

Existe el riesgo de desarrollar funcionalidades que no sean necesarias para validar el problema.

Entre ellas:

* IA;
* GPS continuo;
* integración compleja con WhatsApp;
* aplicaciones móviles nativas;
* pagos;
* facturación;
* dashboards avanzados;
* rutas altamente complejas.

### Mitigación

Toda funcionalidad deberá responder:

```text
¿Qué problema resuelve?
        ↓
¿Qué hipótesis valida?
        ↓
¿Cómo vamos a medir si aporta valor?
```

Si una funcionalidad no resulta necesaria para validar el MVP, se priorizará posteriormente.

---

# 33. Riesgo 3 — Complejidad del ruteo

**Probabilidad:** Alta
**Impacto:** Alto

La optimización de rutas puede convertirse rápidamente en un problema complejo.

Por este motivo, el MVP no intentará resolver simultáneamente:

* tráfico;
* múltiples técnicos;
* ventanas horarias;
* duración variable;
* restricciones de capacidad;
* reasignación automática;
* reoptimización dinámica.

La primera versión utilizará la distancia geográfica como criterio principal para generar un orden sugerido de servicios.

Si esta implementación demuestra ser útil, se evaluarán mejoras posteriores.

---

# 34. Riesgo 4 — Adopción por parte de los técnicos

**Probabilidad:** Alta
**Impacto:** Alto

Existe el riesgo de que los técnicos prefieran continuar utilizando WhatsApp porque ya conocen la herramienta.

El sistema debe aportar una ventaja sin aumentar innecesariamente el trabajo del técnico.

### Mitigación

Se priorizará una interfaz simple:

```text
Abrir servicio
      ↓
Ver información
      ↓
Cambiar estado
      ↓
Finalizar
```

Las operaciones frecuentes deberán requerir la menor cantidad posible de pasos.

La adopción será evaluada durante las pruebas.

---

# 35. Riesgo 5 — Conectividad

**Probabilidad:** Media
**Impacto:** Alto

Los técnicos utilizarán el sistema desde dispositivos móviles, por lo que la conectividad puede afectar la actualización de información.

### Mitigación

El sistema deberá evitar la pérdida de información ante errores normales de conexión.

Las operaciones críticas deberán confirmar al usuario si la información fue almacenada correctamente.

La posibilidad de funcionamiento offline completo queda fuera del MVP inicial.

---

# 36. Privacidad y seguridad

El sistema podrá manejar información de clientes, técnicos y ubicaciones.

Por lo tanto, se deberá considerar:

* autenticación de usuarios;
* autorización según rol;
* acceso restringido a información sensible;
* protección de credenciales;
* almacenamiento seguro;
* permisos para acceder a la ubicación;
* eliminación de información que no sea necesaria.

Las coordenadas de ubicación solo deberán registrarse cuando sean necesarias para una funcionalidad definida del sistema.

---

# 37. Plan de trabajo

## Sprint 0 — Descubrimiento

**Duración:** 1 semana

### Actividades

* validar el problema con la empresa;
* documentar el proceso actual;
* confirmar cantidad de técnicos;
* confirmar cantidad de servicios;
* establecer baseline;
* identificar usuarios;
* definir métricas;
* priorizar backlog;
* definir modelo de dominio;
* definir arquitectura inicial;
* definir MVP.

### Entregable

Documento capaz de responder:

> ¿Qué problema estamos resolviendo y cómo vamos a saber si lo resolvimos?

---

# 38. Sprint 1 — Fundaciones

**Duración:** semanas 2 y 3

### Actividades

* repositorio;
* estructura del proyecto;
* configuración del entorno;
* Docker;
* PostgreSQL;
* autenticación;
* usuarios;
* roles;
* modelo de datos;
* API base;
* integración inicial frontend/backend.

### Entregable

API funcional + base de datos + autenticación.

---

# 39. Sprint 2 — Agenda

**Duración:** semanas 4 y 5

### Funcionalidades

* clientes;
* técnicos;
* servicios;
* agenda;
* asignaciones;
* estados.

### Flujo principal

```text
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

### Entregable

El administrador puede gestionar el ciclo básico de un servicio.

---

# 40. Sprint 3 — Portal del técnico

**Duración:** semanas 6 y 7

### Funcionalidades

* login;
* agenda diaria;
* detalle del servicio;
* ubicación;
* cambio de estado;
* observaciones;
* finalización.

### Entregable

Un técnico puede completar un servicio utilizando la aplicación web desde un teléfono móvil.

---

# 41. Sprint 4 — Rutas y notificaciones

**Duración:** semanas 8 y 9

### Funcionalidades

* cálculo básico de distancias;
* ordenamiento de servicios;
* visualización de ruta;
* notificación de cambios;
* actualización de estados.

La funcionalidad de ruteo será mantenida dentro del alcance definido anteriormente.

No se incorporará reasignación automática.

### Entregable

```text
Administrador modifica servicio
          ↓
Sistema actualiza la agenda
          ↓
Técnico visualiza el cambio
          ↓
Técnico actualiza el estado
          ↓
Administrador visualiza el nuevo estado
```

---

# 42. Sprint 5 — Piloto y validación

**Duración:** semanas 10 y 11

No se priorizará el desarrollo de nuevas funcionalidades.

Se priorizará:

* pruebas;
* corrección de errores;
* capacitación;
* medición;
* observación del uso;
* recopilación de feedback;
* comparación con el baseline.

### Viabilidad del piloto

La realización de un piloto real queda condicionada a confirmar:

* empresa participante;
* cantidad de técnicos participantes;
* disponibilidad de los técnicos;
* período de prueba;
* autorización para utilizar el sistema;
* disponibilidad de dispositivos.

**Estado actual:** [CONFIRMADO / PENDIENTE DE CONFIRMACIÓN]

### Si el piloto real no puede realizarse

Se realizará una prueba controlada con usuarios representativos y se dejará explícitamente indicado que los resultados no equivalen a una validación en condiciones reales.

---

# 43. Criterios de éxito

Los criterios de éxito se evaluarán utilizando los datos obtenidos durante el baseline.

## Operativos

* Al menos el 90 % de los servicios del período piloto deberán gestionarse mediante EasyPool.
* Al menos el 90 % de los servicios deberán finalizar con su estado correctamente actualizado.

## Tiempo

Comparar el tiempo promedio diario dedicado a planificación y coordinación antes y durante el uso de EasyPool.

**Objetivo:** reducción de al menos 50 %.

## Coordinación

Comparar la cantidad de comunicaciones manuales relacionadas con modificaciones de agenda.

**Objetivo:** reducción de al menos 50 %.

## Errores

Registrar las incidencias de coordinación durante baseline y piloto.

**Objetivo:** reducción de al menos 50 %.

La reducción se calculará únicamente cuando exista una cantidad de datos suficiente para realizar una comparación razonable.

## Usabilidad

En lugar de utilizar únicamente un porcentaje arbitrario de satisfacción, se realizará una encuesta breve a los usuarios participantes.

Se preguntará, entre otros aspectos:

* facilidad de uso;
* rapidez;
* claridad de la información;
* dificultad para aprender el sistema;
* comparación con el proceso anterior.

El resultado se analizará junto con las observaciones obtenidas durante el piloto.

---

# 44. Métricas y trazabilidad

Cada métrica deberá responder:

### ¿De dónde surge?

Del proceso actual relevado o de un objetivo definido por el equipo.

### ¿Cómo se mide?

Mediante registros de tiempo, cantidad de servicios, cambios, errores u operaciones.

### ¿Con qué se compara?

Con el baseline obtenido antes de utilizar EasyPool.

### ¿Qué significa éxito?

Se establece previamente un criterio de aceptación y se compara con los resultados obtenidos.

De esta manera se evita presentar como dato real un porcentaje que todavía no fue validado.

---

# 45. Hipótesis de producto

La hipótesis principal es:

> Si centralizamos la agenda, las asignaciones y los estados de los servicios en una única plataforma y permitimos que los técnicos actualicen la información desde sus teléfonos, entonces podríamos reducir el esfuerzo de coordinación administrativa y mejorar la visibilidad del estado de los servicios.

Esta hipótesis será validada mediante:

```text
Proceso actual
      ↓
Baseline
      ↓
Implementación del MVP
      ↓
Uso durante el piloto
      ↓
Medición
      ↓
Comparación
      ↓
Conclusión
```

---

# 46. Qué queda fuera del MVP

Quedan explícitamente fuera del alcance inicial:

* IA predictiva;
* seguimiento GPS continuo;
* aplicación nativa Android;
* aplicación nativa iOS;
* facturación;
* pagos online;
* chat interno;
* integración compleja con WhatsApp;
* reasignación automática de técnicos;
* optimización avanzada de rutas;
* predicción de tráfico;
* portal para clientes;
* notificaciones directas a clientes;
* almacenamiento de fotografías como evidencia.

Estas funcionalidades podrán evaluarse posteriormente si la validación del MVP demuestra que aportan valor.

---

# 47. Conclusión

EasyPool busca resolver un problema concreto de organización y coordinación de servicios de una empresa de mantenimiento de piscinas.

El proceso actual, basado principalmente en Excel y WhatsApp, permite realizar las operaciones necesarias, pero requiere una cantidad significativa de intervención manual y distribuye la información entre diferentes herramientas.

La propuesta consiste en centralizar la información operativa y permitir que administrador y técnicos trabajen sobre una misma plataforma.

El proyecto no parte de la premisa de que EasyPool necesariamente solucionará el problema. La propuesta será considerada exitosa únicamente si las mediciones realizadas durante el piloto muestran una mejora respecto del proceso actual.

Por este motivo, el proyecto distingue entre:

* **datos obtenidos de la empresa;**
* **estimaciones proporcionadas por el propietario;**
* **hipótesis del equipo;**
* **objetivos de validación;**
* **resultados que deberán medirse durante el piloto.**

La prioridad del MVP será demostrar que la solución mejora la organización de los servicios antes de incorporar funcionalidades de mayor complejidad.

El objetivo principal será validar primero el problema y la utilidad de la solución y, a partir de esa evidencia, decidir qué funcionalidades y mejoras deberán desarrollarse posteriormente.

---

# 48. Información pendiente de validar

Antes de presentar la siguiente versión definitiva, el equipo deberá completar:

1. **Cantidad real de técnicos:** [COMPLETAR]
2. **Cantidad aproximada de servicios diarios:** [COMPLETAR]
3. **Cantidad de administradores:** [COMPLETAR]
4. **Cantidad estimada de usuarios simultáneos:** [COMPLETAR]
5. **Experiencia de Tomás con cada tecnología:** [COMPLETAR]
6. **Experiencia de Maximiliano con cada tecnología:** [COMPLETAR]
7. **Experiencia de Eric con cada tecnología:** [COMPLETAR]
8. **¿La empresa acepta realizar el piloto?:** [SÍ / NO / PENDIENTE]
9. **Cantidad de técnicos que participarían del piloto:** [COMPLETAR]
10. **Duración prevista del piloto:** [COMPLETAR]
11. **Período previsto para obtener el baseline:** [COMPLETAR]
12. **Confirmación de que se pueden registrar datos de ubicación:** [COMPLETAR]
13. **Confirmación de si realmente necesitan evidencia fotográfica:** [COMPLETAR]

Una vez obtenidos estos datos, deberán reemplazarse los campos correspondientes y ajustar las métricas que dependan de ellos.
