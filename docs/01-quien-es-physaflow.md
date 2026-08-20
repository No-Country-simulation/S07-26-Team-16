# ¿Quién es PhysaFlow?

*Resumen verificado con fuentes públicas — julio 2026*

PhysaFlow es una startup en etapa temprana dentro del rubro climate tech / infraestructura para data centers. Este documento reúne, con fuentes verificables, qué es la empresa, qué ofrece y con qué tipo de data center trabaja.

---

## 1. Qué es y a qué se dedica

PhysaFlow se describe a sí misma como una empresa de climate tech / infraestructura enfocada en mejorar la eficiencia y la capacidad de los data centers que corren cargas de trabajo de inteligencia artificial. Su propuesta es desbloquear más capacidad utilizable a partir de la infraestructura física y digital que el data center ya tiene instalada, en tiempo real, sin necesidad de agregar hardware nuevo.

El problema que dicen atacar: el hardware de IA genera cada vez más calor y consume más energía, lo que tensiona la capacidad de refrigeración de los data centers. A esto se suma que dos tercios de los data centers en EE.UU. están lejos de fuentes de agua confiables (lo cual complica el enfriamiento a gran escala), que construir un nuevo data center hyperscale toma entre 5 y 7 años incluso para las empresas más grandes, y que estiman que para 2030 los data centers globales consumirán tanta electricidad como un país entero (usan a Japón como comparación). Por eso su propuesta es optimizar lo que ya existe en vez de esperar nueva infraestructura.

El fundador identificado en fuentes públicas es Gonzalo Wartjes (Harvard Graduate School of Arts and Sciences). PhysaFlow fue seleccionada en febrero de 2026 como parte de la quinta cohorte del HAE Accelerator, el programa de aceleración de Harvard Alumni Entrepreneurs impulsado por Pegasus Tech Ventures — un programa sin toma de equity, competitivo (esta cohorte fue elegida entre más de 132 postulaciones). En LinkedIn hay evidencia de que el equipo está creciendo activamente, con al menos una incorporación como "AI/ML Engineering Associate".

## 2. Qué servicios / productos ofrecen

Su producto central se llama **DFI (Distributed Flow Intelligence)**, un motor de IA "edge-native":

- Monitorea de forma continua todas las capas del facility: señales térmicas, de energía, de carga de trabajo y de refrigeración, construyendo un modelo digital en vivo del data center.
- Rebalancea recursos y cargas de trabajo en tiempo real para evitar desperdicio, sin tocar el hardware existente.
- Funciona de forma distribuida (sin control central), inspirado en patrones de la naturaleza como una bandada de pájaros — de ahí la idea de adaptación instantánea sin un punto único de decisión.
- Bridgea todo el stack: desde el workload de un servidor individual hasta el cooling y la distribución de energía de todo el facility.

Su segundo producto se llama **NOI (Network Organism Intelligence)**, orientado a modelado predictivo de escenarios "qué pasaría si" — el tipo de funcionalidad de comparación de escenarios que pide este desafío de diseño.

Un detalle relevante: por defecto, todas las recomendaciones operan en **"Shadow Mode"** (modo sombra, solo lectura). PhysaFlow observa y sugiere, pero no toma acciones de control automáticas a menos que el operador lo habilite explícitamente. También ofrecen dashboards en vivo, con visibilidad instantánea del facility mediante eventos en tiempo real (server-sent events).

## 3. Con qué tipo de data center trabajan

No son data centers propios. PhysaFlow es un proveedor de software (tipo SaaS) que se instala sobre la infraestructura ya existente de sus clientes — el propio sitio se dirige directamente al operador ("tu facility", "tu data center"), no describe centros de datos operados por PhysaFlow. El modelo es ofrecerle esta capa de inteligencia a data centers de terceros.

En cuanto al tipo de facility: hablan específicamente de data centers hyperscale que corren cargas de trabajo de IA, no de un data center genérico. Se apoyan en comparaciones de escala hyperscale (tiempos de construcción de 5-7 años, volúmenes de miles de millones de queries por día) y en hardware de alta densidad (GPUs), que genera mucho más calor que un servidor tradicional.

**¿Entrenamiento o uso/inferencia de IA?** El sitio no hace esa distinción de forma explícita — habla en general de "cargas de trabajo de IA" (AI workloads), sin separar entrenamiento de inferencia. Dicho esto, hay una pista indirecta: el énfasis está puesto en monitoreo continuo y rebalanceo en tiempo real ante demanda variable, algo que encaja más naturalmente con inferencia (que corre las 24 horas, con picos y valles según el uso de los usuarios) que con entrenamiento (que suele ser un trabajo masivo y sostenido, con asignación de recursos más fija durante semanas). Esto es una lectura razonable a partir de cómo describen el producto, no una afirmación textual de PhysaFlow — conviene no darlo por confirmado sin verificarlo directamente con ellos si es un dato crítico para el diseño.

## 4. Definiciones técnicas

| Término | Qué significa |
|---|---|
| DFI (Distributed Flow Intelligence) | Producto principal de PhysaFlow: motor de IA que monitorea el data center en tiempo real y rebalancea cargas y recursos sin agregar hardware. |
| NOI (Network Organism Intelligence) | Segundo producto: modelo de machine learning para simular escenarios "qué pasaría si" (ej. cambiar el tipo de cooling). |
| Edge-native | Que procesa y decide localmente, cerca de donde ocurren los datos, en vez de depender de un servidor central remoto. |
| Shadow Mode (modo sombra) | Modo por defecto de PhysaFlow: solo observa y recomienda, sin tomar acciones de control automáticas. |
| Hyperscale | Categoría de data center de gran escala (miles de servidores), como los que operan las grandes tecnológicas. |
| Stranded capacity | Capacidad instalada que se paga pero no se usa — el problema central que la calculadora del desafío busca cuantificar. |
| Entrenamiento (training) de IA | Proceso de "enseñarle" a un modelo, alimentándolo con grandes volúmenes de datos; suele ser un trabajo sostenido de alta demanda de cómputo. |
| Inferencia (inference) de IA | Uso del modelo ya entrenado para responder consultas reales en producción; suele ser continuo y con demanda variable. |

## 5. Fuentes verificables

| Fuente | Link |
|---|---|
| Sitio oficial de PhysaFlow | https://dev.physaflow.com/ |
| Página de empresa en LinkedIn | https://www.linkedin.com/company/physaflow |
| Anuncio de la cohorte 2026 del HAE Accelerator (Harvard Alumni Entrepreneurs) | https://www.harvardae.org/news/2026/announcing-the-2026-accelerator-cohort |

> **Nota:** no se encontró información pública sobre facturación, cantidad exacta de empleados o clientes activos — es esperable en una startup en etapa de aceleración.

---

*Documento de research — equipo No Country, desafío PhysaFlow / Stranded Capacity Calculator.*
