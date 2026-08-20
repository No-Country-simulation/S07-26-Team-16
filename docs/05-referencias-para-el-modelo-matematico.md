# PhysaFlow — Referencias para el Modelo Matemático

*Documento completo de parámetros, benchmarks y fuentes — julio 2026*

Este documento contiene los parámetros, fórmulas y benchmarks que sustentan el modelo de cálculo de la calculadora: cómo se traduce la energía consumida en costo financiero, cómo se compara el desempeño entre los cuatro tipos de cooling, y cómo se reparte la pérdida entre las capas de facility, IT y workload. Incluye también las tablas de benchmarks consolidados, un glosario de términos, las fuentes verificables y las observaciones sobre el nivel de confianza de cada dato.

---

## Datos que ingresa el usuario

| Parámetro | Métrica | Fórmula / rol en el modelo |
|---|---|---|
| Facility Size | Megavatios (MW) | Input directo — capacidad máxima instalada del data center, base de todos los cálculos |
| Utilization | Porcentaje (0–100%) | Input directo — define qué proporción de la capacidad se está usando actualmente |
| Cooling Type | Categórico (Air / Hybrid / Direct Liquid / Immersion) | Input directo — determina qué PUE de referencia y qué densidad soportada aplica |

## Apartado 1 — Energía y costo financiero

| Parámetro | Valor / Rango | Fórmula | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|---|
| Power Usage Effectiveness (PUE) | Promedio mundial 2024: 1.56. Promedio mundial 2025: 1.54. Rango observado: ~1.2–2.0 | Facility Energy = IT Energy × PUE | Energía total consumida por el Data Center | Uptime Institute — Global Data Center Survey 2024/2025. Definición oficial de The Green Grid | Alta — benchmark internacional | Resultado avanzado |
| Facility Energy | Calculado | Facility Energy = IT Energy × PUE | Consumo energético total del Data Center | Derivado de la definición oficial de PUE | Alta | Resultado avanzado |
| IT Energy | Calculado | IT Energy = Facility Energy / PUE | Energía destinada exclusivamente a la carga IT | Derivado de la definición oficial de PUE | Alta | Resultado avanzado |
| Stranded Capacity (MW) | Calculado | Facility MW × (1 − Utilization) | MW de capacidad no utilizada | No existe fórmula oficial publicada. Estimación propuesta para el prototipo | Estimación de prototipo | Resultado básico |
| Stranded Capacity (%) | Calculado | (Stranded MW / Facility MW) × 100 | Porcentaje de capacidad desperdiciada | Derivado matemáticamente | Estimación de prototipo | Resultado básico |
| Annual Energy Wasted | Calculado | Stranded MW × 8760 | Energía desperdiciada en MWh/año | Conversión estándar de ingeniería energética | Alta | Resultado avanzado |
| Horas por año | 8760 horas | MWh = MW × 8760 | Conversión MW → MWh/año | Constante física (365 × 24) | Máxima | Benchmark |
| Electricity Price | 60–110 USD/MWh (valor medio recomendado: 83 USD/MWh) | Annual Financial Loss = Annual Energy Wasted × Electricity Price | Costo anual estimado de la energía desperdiciada | EIA (tarifas industriales), SemiAnalysis (0.083 USD/kWh), PPA (55–75 USD/MWh) | Benchmark internacional | Resultado básico / avanzado |
| Annual Financial Loss | Calculado | Annual Energy Wasted × Electricity Price | Costo anual estimado asociado a la capacidad desperdiciada | Derivado del costo energético y el consumo anual estimado | Estimación documentada | Resultado básico |

## Apartado 2 — Cooling y comparación de tecnologías

### 2.1 Tecnologías de cooling

| Parámetro | Valor / Rango | Fórmula | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|---|
| Cooling Energy Share | ≈7% (hyperscalers eficientes) a >30% (facilities empresariales menos eficientes) | Cooling Energy = Facility Energy × Cooling Share | Energía consumida exclusivamente por refrigeración | IEA — Energy and AI (2025) | Benchmark internacional | Resultado avanzado / Breakdown |
| Air Cooling | Densidad típica 10–20 kW/rack. Escenario base. Sin PUE oficial único | Escenario base para comparaciones | Referencia para comparar tecnologías | ASHRAE, Schneider Electric, Vertiv | Benchmark publicado por fabricante | Comparación de escenarios |
| Hybrid Cooling | Densidad típica 20–40 kW/rack. Sin benchmark oficial único de ahorro | Comparación contra Air | Escenario intermedio | Schneider Electric, Vertiv | Estimación documentada | Comparación de escenarios |
| Direct Liquid Cooling | Densidad típica 40–80 kW/rack. PUE <1.1 en diseños optimizados (no general) | Comparación contra Air | Mayor eficiencia y soporte para cargas de IA | ASHRAE White Paper de Liquid Cooling; Vertiv, Schneider | Benchmark publicado por fabricante | Comparación de escenarios |
| Immersion Cooling | Densidad >100 kW/rack (100–200+ en muchos casos) | Comparación contra Air | Alta densidad, reducción de infraestructura de cooling | Schneider Electric, ASHRAE, literatura académica | Benchmark publicado por fabricante | Comparación de escenarios |

### 2.2 PUE de referencia por tecnología

| Parámetro | Valor / Rango | Métrica obtenida | Fuente | Confianza |
|---|---|---|---|---|
| PUE de referencia (Air) | 1.40 – 1.60 | Eficiencia energética típica del escenario base | ASHRAE, Vertiv (arquitecturas tradicionales) | Benchmark publicado por fabricante |
| PUE de referencia (Hybrid) | 1.20 – 1.40 | Eficiencia energética típica del escenario intermedio | Schneider, Vertiv (casos de estudio) | Benchmark publicado por fabricante |
| PUE de referencia (Direct Liquid) | 1.05 – 1.20 | Eficiencia energética típica de liquid cooling | ASHRAE, Vertiv | Benchmark publicado por fabricante |
| PUE de referencia (Immersion) | 1.02 – 1.10 | Eficiencia energética típica de immersion cooling | Estudios HPC y fabricantes de immersion | Benchmark publicado por fabricante |

### 2.3 Ahorros y comparaciones entre escenarios

| Parámetro | Valor / Rango | Fórmula | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|---|
| Relative Saving (%) | Calculado — no hay un valor universal publicado | (Baseline − Scenario) / Baseline × 100 | Porcentaje de ahorro entre dos escenarios | Vertiv, Schneider (comparan Air vs Liquid por ahorro relativo) | Estimación documentada | Comparación de escenarios |
| Annual Energy Saving | Calculado | Annual Energy(Current) − Annual Energy(New) | Energía anual ahorrada | Derivado del algoritmo usando Relative Saving | Estimación documentada | Comparación de escenarios |
| Annual Cost Difference | Calculado | Annual Cost(Current) − Annual Cost(New) | Diferencia anual de costos | Derivado del costo energético estimado | Estimación documentada | Comparación de escenarios |
| Capacity Recovery → Recoverable Capacity | Calculado | Stranded MW(Current) − Stranded MW(New) | MW recuperados mediante un escenario alternativo | Derivado del algoritmo del prototipo | Estimación de prototipo | Comparación de escenarios |
| Water Usage (WUE) | No se usa como cálculo principal. Dry coolers: ≈0 agua, ≈300× mejor que torres evaporativas | No aplica al algoritmo base | Indicador de sostenibilidad | The Green Grid (definición de WUE); ASHRAE | Benchmark internacional | Resultado avanzado (opcional) |
| Fan Power Reduction | Hasta ≈80% con liquid cooling vs. 100% air | Comparación relativa | Reducción del consumo auxiliar | Vertiv — estudios de introducción de Liquid Cooling | Benchmark publicado por fabricante | Comparación de escenarios |
| Infrastructure Power Reduction | ≈18% en escenarios específicos de liquid cooling | Comparación relativa | Reducción del consumo no-IT | Vertiv | Benchmark publicado por fabricante | Comparación de escenarios |
| Facility Power Reduction | ≈18.1% (Air → 75% direct-to-chip liquid) | Comparación relativa | Consumo total de facility reducido | Vertiv + NVIDIA — estudio de eficiencia | Benchmark publicado por fabricante | Comparación de escenarios |
| Total Data Center Power Reduction | ≈10.2% (mismo estudio) | Comparación relativa | Consumo total del data center reducido | Vertiv + NVIDIA | Benchmark publicado por fabricante | Comparación de escenarios |
| IT Power Reduction | ≈7–10% | Comparación relativa | Reducción de consumo del lado IT | Vertiv / ASHRAE | Estimación documentada — dato menos formalizado que el resto | Comparación de escenarios |

### 2.4 Densidad y umbrales técnicos

| Parámetro | Valor / Rango | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|
| Densidad soportada (kW/rack) | Air 10–20 · Hybrid 20–40 · Direct Liquid 40–80 · Immersion 100–200+ | Densidad máxima de carga IT soportable por tecnología | ASHRAE, Vertiv | Benchmark publicado por fabricante | Comparación de escenarios |
| AI Rack Density | Tradicional 5–15 kW/rack · IA/GPU 50–120+ kW/rack | Contraste entre carga tradicional y de IA | ASHRAE | Benchmark internacional | Resultado avanzado (contextual) |
| Cooling Recommendation Threshold | ≈50 kW/rack | Umbral de recomendación técnica: densidad > 50 kW/rack ⇒ evaluar Liquid Cooling | ASHRAE | Benchmark internacional | Recommendations |

### Observaciones del Apartado 2

- El tipo de cooling **no** determina el PUE de forma oficial — ningún organismo internacional publica una tabla única; los valores existentes son benchmarks de fabricantes (ASHRAE, Vertiv, Schneider), no estándares.
- Air Cooling se utiliza como escenario base porque todos los fabricantes lo usan así para sus comparativas de ahorro.
- Direct Liquid e Immersion no solo "consumen menos": permiten mayor densidad de rack, menor consumo de ventiladores, reutilización de calor y mejor soporte para cargas de IA.
- Water Usage se incorpora como benchmark documentado, no como parte del algoritmo del MVP — el usuario no provee ningún dato de agua.
- La comparación entre tecnologías se hace mediante mejoras relativas (Relative Saving), no mediante un PUE fijo por tecnología.
- Heat Reuse queda solo como observación: la refrigeración líquida facilita reutilizar el agua caliente de salida (métricas ERE/ERF de The Green Grid), pero no se calcula por falta de datos de entrada.
- Las mejoras se clasifican en tres tipos — energética, económica y operativa — lo que ayuda a estructurar la sección de Compare Scenarios del producto final.

## Apartado 3 — Breakdown por capas, comparación de escenarios y recomendaciones

### 3.1 Layer Breakdown

| Parámetro | Fórmula | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|
| Facility Energy | IT Energy × PUE | Consumo total | Ver Apartado 1 | Benchmark internacional | Resultado avanzado |
| IT Energy | Facility / PUE | Energía IT | Ver Apartado 1 | Benchmark internacional | Resultado avanzado |
| Cooling Energy | Facility × Cooling Share | Energía de refrigeración | IEA | Benchmark internacional | Breakdown |
| Stranded Energy | Stranded MW × 8760 | Energía desperdiciada | Ver Apartado 1 | Estimación documentada | Breakdown |

### 3.2 Compare Scenarios

| Parámetro | Valor / Rango | Fórmula | Métrica obtenida | Fuente | Confianza |
|---|---|---|---|---|---|
| Annual Energy Saving | Calculado | Current − Scenario | MWh/año ahorrados | Derivado del algoritmo | Estimación documentada |
| Annual Cost Difference | Calculado | Current − Scenario | USD/año de diferencia | Derivado del algoritmo | Estimación documentada |
| Facility Power Reduction | Benchmark (≈18.1%) | Benchmark aplicado al escenario | % de reducción | Vertiv + NVIDIA | Benchmark publicado por fabricante |
| Total Data Center Power Reduction | Benchmark (≈10.2%) | Benchmark aplicado al escenario | % de reducción | Vertiv + NVIDIA | Benchmark publicado por fabricante |
| Fan Power Reduction | Benchmark (≈80%) | Benchmark aplicado al escenario | % de reducción | Vertiv | Benchmark publicado por fabricante |
| Water Usage Improvement | Benchmark (≈300× mejor con dry coolers) | Benchmark aplicado al escenario | % de mejora | ASHRAE | Benchmark internacional |
| Relative Saving | Calculado | Current vs Scenario | % de ahorro | Vertiv, Schneider | Estimación documentada |

### 3.3 Recommendations y nuevas métricas

| Parámetro | Valor / Rango | Fórmula | Métrica obtenida | Fuente | Confianza | Uso recomendado |
|---|---|---|---|---|---|---|
| IT Work Capacity (ITWC) | Métrica de The Green Grid | No calculable con los inputs del MVP | Trabajo útil entregado por la infraestructura IT — equivale a la capa Workload del challenge | ASHRAE / The Green Grid | Benchmark internacional | Visualización Workload |
| Recoverable Capacity | Calculado | Current Stranded MW − Optimized Stranded MW | MW recuperables bajo un escenario alternativo | Estimación para prototipo | Estimación documentada | Compare Scenarios |
| Recommended Cooling Strategy | Regla basada en benchmark | Densidad > 50 kW/rack ⇒ evaluar Liquid Cooling | Recomendación técnica | ASHRAE | Benchmark internacional | Recommendations |
| Cooling Optimization Opportunity | Regla basada en benchmark | Cooling Share o PUE de referencia elevados | Oportunidad de optimización | ASHRAE / Schneider | Estimación documentada | Recommendations |
| High Cooling Overhead | Regla cualitativa | Cooling Share por encima del rango eficiente (~7%) | Señal de alerta, no umbral numérico fijo | IEA / ASHRAE | Estimación documentada | Recommendations |
| High Rack Density | Regla cualitativa | Densidad > 50 kW/rack | Señal de alerta para migrar de cooling | ASHRAE | Benchmark internacional | Recommendations |

### Observaciones del Apartado 3

- No existe un breakdown energético oficial único del data center — depende del tipo de instalación. El reparto clásico "IT consume 70%" no aplica en centros de IA modernos: Schneider reporta que ahí la infraestructura (cooling + electrical + MEP) sube a ≈55%, casi empatando con IT (≈45%).
- La representación Facility → IT → Workload evolucionó durante la investigación hacia: Facility Power → IT Equipment → IT Work Capacity → Useful Workload → Stranded Capacity, incorporando ITWC.
- IT Work Capacity (ITWC) fue el hallazgo más importante del apartado: es una métrica real de The Green Grid que mide el trabajo útil entregado por la infraestructura IT — coincide exactamente con la capa Workload que pide el challenge.
- La terminología de "Capacity Recovery" se reemplaza por "Recoverable Capacity", alineada con cómo Schneider divide la capacidad: Spare Capacity, Idle Capacity, Safety Margin, Stranded Capacity.
- Los fabricantes (Schneider, Vertiv, Uptime) suelen representar la capacidad como Available → Used → Remaining → Stranded, no como Facility → IT → Workload — lo que confirma que el enfoque de PhysaFlow es distintivo, no una convención ya estandarizada.
- Heat Reuse queda solo como observación, no como cálculo: se documenta que el agua caliente de salida puede reutilizarse (ERE/ERF de The Green Grid), pero no hay datos de entrada del usuario para incorporarlo al algoritmo.
- Las recomendaciones se basan en Recommended Practices publicadas (ASHRAE, Schneider), no en umbrales numéricos inventados — esto las hace defendibles ante preguntas del jurado.
- La densidad de rack no puede calcularse con los tres inputs actuales del challenge (MW, Utilización, Cooling) — falta la cantidad de racks o la carga IT por rack. Se deja como benchmark contextual, no como resultado calculado.

## Tablas complementarias

### C.1 — PUE consolidado por tipo de cooling

| Tecnología | PUE de referencia | Nivel |
|---|---|---|
| Air Cooling | 1.40 – 1.60 | Benchmark publicado por fabricante |
| Hybrid Cooling | 1.20 – 1.40 | Benchmark publicado por fabricante |
| Direct Liquid Cooling | 1.05 – 1.20 | Benchmark publicado por fabricante |
| Immersion Cooling | 1.02 – 1.10 | Benchmark publicado por fabricante |

### C.2 — Densidad soportada por tipo de cooling (kW/rack)

| Tecnología | Densidad soportada |
|---|---|
| Air Cooling | 10–20 kW/rack |
| Hybrid Cooling | 20–40 kW/rack |
| Direct-to-Chip Liquid | 40–80 kW/rack |
| Immersion Cooling | 100–200+ kW/rack |

### C.3 — Precio de electricidad por región (referencia)

| Región | Precio industrial aproximado | Equivalencia | Uso en el prototipo |
|---|---|---|---|
| Texas (EE.UU.) | ≈70–90 USD/MWh | 0,07–0,09 USD/kWh | Valor mínimo del rango |
| Virginia (EE.UU.) | ≈80–100 USD/MWh | 0,08–0,10 USD/kWh | Valor bajo–medio |
| Promedio EE.UU. (Industrial) | ≈90–110 USD/MWh | 0,09–0,11 USD/kWh | Benchmark general |
| Alemania | ≈226 EUR/MWh (2do semestre 2025) | 0,226 EUR/kWh | Valor máximo europeo |
| Irlanda | ≈255 EUR/MWh (2do semestre 2025) | 0,255 EUR/kWh | Máximo del rango europeo |
| Promedio Unión Europea | ≈184 EUR/MWh (2do semestre 2025) | 0,184 EUR/kWh | Benchmark europeo |
| **Rango final recomendado (prototipo)** | **60–110 USD/MWh (medio: 83 USD/MWh)** | — | Optimistic / Typical / Conservative |

### C.4 — Ahorro relativo de energía por tecnología (vs. Air Cooling)

| Cooling | Energy Saving |
|---|---|
| Hybrid | ≈8% |
| Liquid | ≈18% |
| Immersion | ≈25% |

### C.5 — Resultados del estudio Vertiv + NVIDIA (100% Air → 75% Direct-to-Chip Liquid)

| Métrica | Mejora observada |
|---|---|
| Facility Power | −18.1% |
| Total Data Center Power | −10.2% |
| IT Fan Power | −80% |
| IT Power | −7% a −10% |
| TUE (Total Usage Effectiveness) | +15.5% |
| PUE solo mejora | +3.3% — PUE puede ser engañoso al comparar air vs. liquid |
| Water Usage | ≈300× menos agua (dry coolers vs. torres evaporativas) |

### C.6 — Breakdown energético del facility: modelo tradicional vs. data center de IA

| Modelo | Componente | Participación |
|---|---|---|
| Tradicional (Uptime / genérico) | IT Equipment | ≈70% |
| Tradicional (Uptime / genérico) | Cooling | ≈20% |
| Tradicional (Uptime / genérico) | UPS / Electrical | ≈7% |
| Tradicional (Uptime / genérico) | Lighting + Misc | ≈3% |
| Data Center de IA (Schneider) | IT Equipment | ≈45% |
| Data Center de IA (Schneider) | Infraestructura (Cooling + Electrical + MEP) | ≈55% |

El contraste entre ambos modelos es el hallazgo clave del apartado: en un data center de IA, la infraestructura de soporte gana peso frente al IT, rompiendo el supuesto clásico.

## Glosario de términos

| Término | Significado |
|---|---|
| PUE (Power Usage Effectiveness) | Ratio entre la energía total del facility y la energía que llega solo al equipo de IT. Definido por The Green Grid; es un benchmark, no debe usarse para comparar directamente dos data centers porque depende del clima, la antigüedad, la redundancia y la carga IT, entre otros factores. |
| WUE (Water Usage Effectiveness) | Métrica de The Green Grid para medir el consumo de agua de un data center en relación a la energía usada por el equipo de IT. |
| TUE (Total Usage Effectiveness) | Métrica más amplia que el PUE, usada principalmente por Vertiv: incorpora energía IT, energía de refrigeración y pérdidas adicionales. No se usa en el algoritmo del MVP porque el challenge no la menciona. |
| ITWC (IT Work Capacity) | Métrica de The Green Grid / ASHRAE que mide el trabajo útil que entrega realmente la infraestructura IT — corresponde a la capa Workload del challenge. |
| Cooling Energy Share | Porcentaje del consumo total del data center que corresponde específicamente a refrigeración. |
| Spare / Idle / Safety Margin / Stranded Capacity | Terminología de Schneider Electric para dividir la capacidad no utilizada de un data center según su causa. |
| PPA (Power Purchase Agreement) | Contrato de compra de energía a largo plazo, frecuentemente usado por hyperscalers en vez de pagar la tarifa industrial estándar. |
| kW/rack | Densidad de potencia informática que puede alojar un rack de servidores — determina qué tecnología de cooling es viable. |

## Fuentes verificables

| Fuente | Link |
|---|---|
| Uptime Institute — Global Data Center Survey 2024 (PUE 1.56) | https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2024 |
| Uptime Institute — Global Data Center Survey 2025 (PUE 1.54) | https://intelligence.uptimeinstitute.com/resource/uptime-institute-global-data-center-survey-2025 |
| EIA — Precio industrial de electricidad por estado (tabla oficial) | https://www.eia.gov/electricity/sales_revenue_price/pdf/table_4.pdf |
| Eurostat — Electricity price statistics (Alemania, Irlanda, UE) | https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Electricity_price_statistics |
| IEA — Energy and AI 2025 (Cooling Energy Share 7–30%) | https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai |
| SemiAnalysis — AI Datacenter Energy Dilemma (PUE 1.25, 80% util., 0.083 USD/kWh) | https://newsletter.semianalysis.com/p/ai-datacenter-energy-dilemma-race |
| Vertiv — Understanding the limitations of PUE (Facility Power -18.1%, Total DC Power -10.2%) | https://www.vertiv.com/en-us/about/news-and-events/articles/blog-posts/understanding-the-limitations-of-pue-in-evaluating-liquid-cooling-efficiency/ |
| Vertiv — Quantifying the impact of liquid cooling (TUE +15.5%, Fan Power -80%) | https://www.vertiv.com/en-us/about/news-and-events/articles/blog-posts/quantifying-data-center-pue-when-introducing-liquid-cooling/ |
| Schneider Electric — White Paper 110, The AI Disruption | https://www.se.com/ww/en/download/document/SPD_WP110_EN/ |
| The Green Grid — WP #94, IT Work Capacity (ITWC) Methodology | https://www.thegreengrid.org/resources/library-and-tools/wp-94-itwc-methodology-calculate-server-work-capacity-cserv-data |
| ASHRAE — Emergence and Expansion of Liquid Cooling in Mainstream Data Centers | https://www.ashrae.org/file%20library/technical%20resources/bookstore/emergence-and-expansion-of-liquid-cooling-in-mainstream-data-centers_wp.pdf |

### Observaciones generales

- De los 46 parámetros documentados, 2–3 (Total Data Center Power Reduction, IT Power Reduction, y en menor medida el "Total" dentro de Compare Scenarios) tienen datos numéricos pero no llegaron a tener una ficha tan completa de fórmula/fuente como el resto — quedaron marcados como "menos formalizados" en sus filas correspondientes.
- Este documento es independiente de los dos anteriores ("Modelo de Cálculo" y "Parámetros de Referencia"): no los reemplaza ni los modifica. Sin embargo, el equipo debería revisar en algún momento cómo se relacionan, porque este documento resuelve con datos reales varias cosas que en los otros quedaron como supuestos (el margen de redundancia, el costo por MW, el breakdown por capa).
- El hallazgo más valioso para el diseño de la visualización de las tres capas es ITWC: es la primera vez que aparece una métrica estándar real que corresponde específicamente a la capa Workload del challenge.
- Todos los valores marcados como "Benchmark publicado por fabricante" o "Estimación documentada" son defendibles para un prototipo, pero no deben presentarse como estándares internacionales — esa distinción está marcada en la columna de Confianza de cada fila.

---

*Documento de research — equipo No Country, desafío PhysaFlow / Stranded Capacity Calculator.*
