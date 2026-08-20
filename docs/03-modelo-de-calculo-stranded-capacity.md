# Modelo de Cálculo — Stranded Capacity Calculator

*Profundización y optimización del modelo de cálculo — julio 2026*

Este documento profundiza y optimiza el modelo de cálculo de la calculadora. El breakdown por capa deja de ser un porcentaje fijo y pasa a calcularse a partir de un parámetro real de la industria en cada capa: PUE (Power Usage Effectiveness) para la capa de facility, margen de redundancia para la capa de IT, y la utilización ingresada por el usuario para la capa de workload. Se detallan las fórmulas para los cuatro tipos de cooling relevantes: Air, Hybrid, Liquid e Immersion.

---

## 1. Modelo general (aplica a los cuatro tipos de cooling)

**Inputs:** Facility_MW, Utilization_%, Cooling_Type (Air / Hybrid / Liquid / Immersion).

**Versión simplificada inicial (referencia):**

```
capacidad_utilizable = facility_mw × (1 − margen_seguridad)
stranded_mw = capacidad_utilizable − (facility_mw × utilizacion_pct / 100)
stranded_pct = stranded_mw / facility_mw × 100

costo_anual_min = stranded_mw × 400.000
costo_anual_max = stranded_mw × 550.000
```

Esta versión da un único número de stranded capacity, sin distinguir en qué capa ocurre la pérdida. El modelo optimizado que se detalla a continuación separa la pérdida en tres capas explícitas, cada una calculada a partir de un parámetro real distinto:

**Modelo optimizado (actual):**

```
Effective_IT_MW = Facility_MW / PUE(cooling_type)
Facility_Overhead_MW = Facility_MW − Effective_IT_MW

Usable_IT_MW = Effective_IT_MW × (1 − redundancy_margin)
IT_Reserved_MW = Effective_IT_MW − Usable_IT_MW

Used_MW = Usable_IT_MW × (Utilization_% / 100)
Workload_Idle_MW = Usable_IT_MW − Used_MW

Stranded_MW = Facility_Overhead_MW + IT_Reserved_MW + Workload_Idle_MW
Stranded_% = Stranded_MW / Facility_MW × 100

AnnualLoss_min = Stranded_MW × 200.000
AnnualLoss_avg = Stranded_MW × 250.000
AnnualLoss_max = Stranded_MW × 300.000
```

`redundancy_margin` se usa como 15% para los cuatro tipos de cooling (es una asunción, no varía por tipo de cooling sino por diseño eléctrico — ver apartado 4 sobre qué falta investigar). Los ejemplos de este documento usan un caso base fijo para poder comparar entre tipos: Facility = 5 MW, Utilización = 60%.

## 2. Cálculos separados por tipo de cooling

### 2.1 Air

PUE de referencia: 1.6 — 1.4 – 1.8 (rango reportado por múltiples fuentes de industria, 2025-2026).

```
Effective_IT_MW = 5 / 1.6 = 3.1250 MW      → Facility_Overhead_MW = 1.8750 MW
Usable_IT_MW = 3.1250 × 0.85 = 2.6562 MW   → IT_Reserved_MW = 0.4688 MW
Used_MW = 2.6562 × 0.60 = 1.5938 MW        → Workload_Idle_MW = 1.0625 MW
```

| Resultado | Valor |
|---|---|
| Stranded_MW | 3.41 MW |
| Stranded_% | 68.1% |
| Breakdown por capa | Facility 55.0% / IT 13.8% / Workload 31.2% |
| Pérdida anual (min–avg–max) | $681,250 – $851,562 – $1,021,875 |

### 2.2 Hybrid

PUE de referencia: 1.3 — Sin dato público específico — estimado por interpolación entre Air y Liquid.

```
Effective_IT_MW = 5 / 1.3 = 3.8462 MW      → Facility_Overhead_MW = 1.1538 MW
Usable_IT_MW = 3.8462 × 0.85 = 3.2692 MW   → IT_Reserved_MW = 0.5769 MW
Used_MW = 3.2692 × 0.60 = 1.9615 MW        → Workload_Idle_MW = 1.3077 MW
```

| Resultado | Valor |
|---|---|
| Stranded_MW | 3.04 MW |
| Stranded_% | 60.8% |
| Breakdown por capa | Facility 38.0% / IT 19.0% / Workload 43.0% |
| Pérdida anual (min–avg–max) | $607,692 – $759,615 – $911,538 |

### 2.3 Liquid (direct-to-chip)

PUE de referencia: 1.1 — 1.05 – 1.15 (rango reportado, cooling líquido directo al chip).

```
Effective_IT_MW = 5 / 1.1 = 4.5455 MW      → Facility_Overhead_MW = 0.4545 MW
Usable_IT_MW = 4.5455 × 0.85 = 3.8636 MW   → IT_Reserved_MW = 0.6818 MW
Used_MW = 3.8636 × 0.60 = 2.3182 MW        → Workload_Idle_MW = 1.5455 MW
```

| Resultado | Valor |
|---|---|
| Stranded_MW | 2.68 MW |
| Stranded_% | 53.6% |
| Breakdown por capa | Facility 16.9% / IT 25.4% / Workload 57.6% |
| Pérdida anual (min–avg–max) | $536,364 – $670,455 – $804,545 |

### 2.4 Immersion

PUE de referencia: 1.03 — 1.02 – 1.05 (rango reportado para despliegues de immersion cooling optimizados).

```
Effective_IT_MW = 5 / 1.03 = 4.8544 MW     → Facility_Overhead_MW = 0.1456 MW
Usable_IT_MW = 4.8544 × 0.85 = 4.1262 MW   → IT_Reserved_MW = 0.7282 MW
Used_MW = 4.1262 × 0.60 = 2.4757 MW        → Workload_Idle_MW = 1.6505 MW
```

| Resultado | Valor |
|---|---|
| Stranded_MW | 2.52 MW |
| Stranded_% | 50.5% |
| Breakdown por capa | Facility 5.8% / IT 28.8% / Workload 65.4% |
| Pérdida anual (min–avg–max) | $504,854 – $631,068 – $757,282 |

## 3. Comparación resumen — mismo facility, mismo uso, distinto cooling

Facility = 5 MW, Utilización = 60% en los cuatro casos. Lo único que cambia es el tipo de cooling:

| Cooling | PUE | Stranded % | Facility | IT | Workload |
|---|---|---|---|---|---|
| Air | 1.6 | 68.1% | 55.0% | 13.8% | 31.2% |
| Hybrid | 1.3 | 60.8% | 38.0% | 19.0% | 43.0% |
| Liquid | 1.1 | 53.6% | 16.9% | 25.4% | 57.6% |
| Immersion | 1.03 | 50.5% | 5.8% | 28.8% | 65.4% |

El patrón es consistente: a mejor cooling, menor stranded % total, pero el origen del problema se corre de la capa de facility hacia la capa de workload — con immersion, casi toda la pérdida es por ociosidad real (falta de uso), no por ineficiencia de refrigeración.

## 4. Qué podríamos investigar más para mejorar los cálculos

- **Margen de redundancia real por configuración (N, N+1, 2N):** hoy usamos 15% fijo para los cuatro tipos de cooling, sin fuente publicada específica. Buscar estándares de Uptime Institute Tier Classification o ASHRAE para reemplazar este supuesto por un rango validado.
- **PUE específico de Hybrid cooling:** no encontramos un dato publicado directo, solo la definición del concepto. El valor 1.3 es una interpolación nuestra entre Air y Liquid — sería mejor conseguir un estudio o encuesta de industria que lo reporte específicamente.
- **Costo real de stranded capacity por MW/año:** los valores 200.000 / 250.000 / 300.000 USD son un supuesto. Lo más cercano que encontramos publicado es costo de downtime (interrupción total del servicio), que es un concepto relacionado pero no idéntico a capacidad ociosa continua. Convendría buscar estudios que hablen puntualmente de costo de capacidad no utilizada, no de outages.
- **Costo de electricidad por región (USD/kWh):** el costo real varía mucho según el país o estado donde esté el data center. Si el producto se usa en distintas regiones, el rango de pérdida financiera debería poder ajustarse por ubicación.
- **Utilización promedio real por tipo de carga (entrenamiento vs. inferencia):** tener benchmarks de utilización típica ayudaría a poner un valor por defecto o rango de referencia en el input, en vez de que el operador tenga que estimarlo a ojo.
- **Validar si conviene medir el "overhead de facility" con PUE** (que mide energía) o si existe una métrica de capacidad en MW más directa — PUE es un proxy energético, no una medición exacta de capacidad perdida.

## 5. Glosario de términos usados en este documento

| Término | Significado |
|---|---|
| PUE (Power Usage Effectiveness) | Métrica estándar de la industria: energía total consumida por el data center dividida por la energía consumida solo por el equipo de IT. Un PUE de 1.5 significa que por cada watt usado en cómputo, se gasta otro medio watt en cooling y overhead. |
| Stranded capacity | Capacidad instalada que se paga pero no se usa — el problema central que la calculadora busca cuantificar. |
| MW (Megawatt) | Unidad de potencia usada para medir el tamaño de un data center. |
| Effective IT capacity | La capacidad que efectivamente llega al equipo de IT después de restar el overhead de cooling y distribución de energía del facility. |
| Margen de redundancia | Porcentaje de capacidad que se reserva como colchón de seguridad ante fallas (ej. configuraciones N+1 o 2N), no disponible para carga de trabajo normal. |
| Air cooling | Sistema de refrigeración tradicional basado en circulación de aire (CRAC, CRAH, contención de pasillos). |
| Hybrid cooling | Combina cooling por aire y por líquido en la misma facility — típicamente liquid cooling directo al chip para los componentes de mayor calor (GPUs) y aire para el resto. Es la solución más común hoy en facilities de IA que están migrando gradualmente desde aire. |
| Liquid cooling (direct-to-chip) | Sistema que usa un líquido refrigerante para absorber calor directamente desde placas montadas sobre los componentes que más calor generan. |
| Immersion cooling | Técnica de liquid cooling en la que los servidores se sumergen directamente en un fluido dieléctrico (no conductivo). Es más eficiente que el direct-to-chip, pero de adopción mucho menor en la industria. |
| Facility / IT / Workload (capas) | Las tres capas del modelo: Facility es la capacidad máxima instalada, IT es lo que llega efectivamente a los servidores, Workload es lo que realmente se usa para cómputo. |

## 6. Fuentes / links de referencia

| Fuente | Link |
|---|---|
| PUE de Air vs Liquid cooling — Introl | https://introl.com/blog/liquid-vs-air-cooling-ai-data-centers |
| Liquid cooling como estándar 2025 — Datacenters.com | https://www.datacenters.com/news/why-liquid-cooling-is-becoming-the-data-center-standard |
| Uptime Institute 2025 Global Data Center Survey (PUE por segmento) | https://mgrid.org/2025/10/01/uptime-institute-data-center-pue-stagnation-2025-liquid-cooling/ |
| PUE 1.09 en AI data centers — Introl | https://introl.com/blog/pue-109-google-data-center-efficiency-strategies |
| Immersion cooling benchmarks — Energy Solutions Intelligence | https://energy-solutions.co/articles/sub/data-center-cooling-liquid-immersion-vs-air |
| Qué es Hybrid Cooling — Stulz | https://blog.stulz-usa.com/hybrid-data-center-cooling |
| Glosario de tipos de cooling — Data Center Frontier | https://www.datacenterfrontier.com/cooling/article/55389787/tech-explainer-data-center-cooling-air-evaporative-liquid-and-hybrid-approaches |
| Annual Outage Analysis 2026 — Uptime Institute (referencia de costos) | https://intelligence.uptimeinstitute.com/resource/annual-outage-analysis-2026 |

> **Nota:** los valores marcados como "estimado" o "supuesto" en este documento no tienen fuente publicada directa y deberían tratarse como punto de partida, no como dato validado.

---

*Documento de trabajo — equipo No Country, desafío PhysaFlow / Stranded Capacity Calculator.*
