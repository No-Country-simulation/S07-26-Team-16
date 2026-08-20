# Documentación de apoyo

Esta sección reúne la documentación generada durante las distintas etapas de desarrollo de la **Stranded Capacity Calculator para PhysaFlow**.

Los documentos están organizados siguiendo el orden en el que fueron elaborados durante el proyecto. En conjunto, muestran la evolución desde la investigación inicial y el planteamiento del problema hasta la definición del modelo de cálculo, las exploraciones de diseño y la especificación técnica del sistema.

Esta documentación tiene como objetivo dejar registro del proceso de investigación, las decisiones tomadas y los fundamentos utilizados para desarrollar el producto.

---

## Documentos

### 01 — ¿Quién es PhysaFlow?

Investigación inicial sobre PhysaFlow, su actividad, contexto, productos y el problema planteado en el desafío.

[Ver documento](./01-quien-es-physaflow.md)

---

### 02 — PhysaFlow — Calculadora de Stranded Capacity

Definición inicial de la calculadora, su funcionamiento y la lógica de las tres capas principales del sistema:

**Facility → IT → Workload**

[Ver documento](./02-calculadora-stranded-capacity.md)

---

### 03 — Modelo de Cálculo — Stranded Capacity Calculator

Profundización y optimización del modelo de cálculo utilizado por la calculadora.

Incluye la evolución de las fórmulas y la definición de los principales componentes utilizados para estimar la capacidad desperdiciada.

[Ver documento](./03-modelo-de-calculo-stranded-capacity.md)

---

### 04 — Capturas y exploraciones

Registro de las distintas exploraciones visuales realizadas durante el proceso de diseño.

Este material reúne capturas y propuestas utilizadas para explorar diferentes formas de representar la información y construir la experiencia final de la calculadora.

[Ver documento](./04-capturas-y-exploraciones.md)

---

### 05 — PhysaFlow — Referencias para el Modelo Matemático

Documento de referencia que reúne los parámetros, benchmarks, fuentes y datos utilizados para respaldar el modelo matemático.

Incluye información sobre PUE, tipos de cooling, densidad soportada, precios de electricidad, ahorro energético, breakdown del consumo y otras métricas relevantes.

También contiene el research complementario y las fuentes verificables utilizadas durante el proyecto.

[Ver documento](./05-referencias-para-el-modelo-matematico.md)

---

### 06 — Opciones Gráficas para la Calculadora

Exploración de diferentes alternativas de visualización para los datos y resultados que debía mostrar la calculadora.

Se analizaron alternativas para:

- Stranded Capacity.
- Pérdida financiera.
- Breakdown por capas.
- Comparación de escenarios.
- Resultado compartible.
- PUE.
- Densidad.
- Precio de electricidad.
- Ahorro energético.

[Ver documento](./06-opciones-graficas-para-la-calculadora.md)

---

### 07 — PhysaFlow — Pseudocódigo del Sistema (Input/Output)

Especificación técnica del funcionamiento de la calculadora.

Describe los inputs, constantes, funciones, outputs y flujo de información entre los diferentes momentos y apartados del sistema.

Este documento sirve como conexión entre el modelo matemático, el diseño realizado en Figma y la implementación frontend.

[Ver documento](./07-pseudocodigo-del-sistema.md)

---

## Relación con el proyecto

Esta documentación complementa el código fuente y los diseños del proyecto.

- **Investigación:** permite comprender el contexto y las fuentes utilizadas.
- **Modelo:** documenta cómo se definieron los cálculos.
- **Exploración:** muestra la evolución de las decisiones de diseño.
- **Pseudocódigo:** especifica cómo se traduce el modelo en lógica de sistema.
- **Implementación:** el código fuente contiene la versión funcional de la calculadora.

El objetivo es que el proyecto pueda ser comprendido no solo desde el resultado final, sino también desde el proceso que llevó a su construcción.
