"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import {
  calculate,
  COOLING_OPTIONS,
  REDUNDANCY_MARGIN,
  HOURS_PER_YEAR,
  ELECTRICITY_PRICE_AVG,
  type CalculatorResult,
  type CoolingType,
} from "@/components/capacity-calculator"
import {
  Building2,
  Server,
  Cpu,
  ArrowDown,
  ChevronDown,
  Check,
  TrendingDown,
  Coins,
  Zap,
  Factory,
  Wind,
  Gauge,
  Layers,
  type LucideIcon
} from "lucide-react"

/* ---------- palette (mirrors CapacityCalculator) ---------- */
const GOLD = "#d4a94e"
const GOLD_DARK = "#a27e2d"
const GOLD_LIGHT = "#e8c777"
const FOREST = "#003a27"
const FOREST_DEEP = "#00281b"
const GREEN_ACCENT = "#34d399"
const GREEN_MID = "#5eead4"
const GREEN_SOFT = "#99f6e4"
const GREEN_PALE = "#d1fae5"
const TRACK = "rgba(255,255,255,0.1)"
const GRID_LINE = "rgba(255,255,255,0.12)"

const PANEL_BORDER =
  "bg-[linear-gradient(135deg,rgba(212,169,78,0.55),rgba(162,126,45,0.18),rgba(26,107,79,0.35))]"

/* ---------- helpers ---------- */
const clamp = (v: number) => Math.max(0, Math.min(100, v))
// Helper local para clamping con min/max custom (tu `clamp` global solo hace 0-100)
const clampRange = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function fmtMW(v: number) {
  return `${v.toFixed(2)} MW`
}

function fmtUsd(v: number) {
  const abs = Math.abs(v)
  const sign = v < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`
  return `${sign}$${Math.round(abs)}`
}

const COOLING_LABEL: Record<CoolingType, string> = {
  air: "Air",
  hybrid: "Hybrid",
  liquid: "Liquid",
  immersion: "Immersion",
}

const EFFICIENCY_ORDER: CoolingType[] = ["immersion", "liquid", "hybrid", "air"]

const ELECTRICITY_REGIONS = [
  { region: "PPA solar", price: 60 },
  { region: "PPA eólica", price: 75 },
  { region: "Texas", price: 80 },
  { region: "Virginia", price: 90 },
  { region: "Promedio EE.UU.", price: 100 },
  { region: "Promedio UE", price: 199 },
  { region: "Alemania", price: 244 },
  { region: "Irlanda", price: 275 },
]

function radarAxes(r: CalculatorResult) {
  const opt = COOLING_OPTIONS.find((c) => c.value === r.coolingType)!
  const densAvg = (opt.densityLow + opt.densityHigh) / 2
  return [
    { axis: "Uso eficiente", value: clamp(100 - r.strandedPercent) },
    { axis: "PUE", value: clamp((100 * (2.0 - r.pue)) / 1.0) },
    { axis: "Pérdida anual", value: clamp(100 * (1 - r.annualLossAvg / 20_000_000)) },
    { axis: "Densidad", value: clamp(100 * (densAvg / 200)) },
  ]
}

/* ---------- shared shell (gradient border + dark forest card) ---------- */
function Panel({
  children,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <div className={`relative rounded-2xl p-px transition-all duration-300 ${PANEL_BORDER} ${className}`}>
      <div className={`relative flex h-full flex-col rounded-2xl bg-[#003a27]/90 p-6 lg:p-8 ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}

/* small nested box used inside panels (mirrors the calculator's inputs) */
function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#00281b] p-4 ${className}`}>{children}</div>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#a27e2d]">{children}</p>
  )
}

/* ================================================================== */

export function FullDashboard({
  result,
  singleColumn = false,
}: {
  result: CalculatorResult
  singleColumn?: boolean
}) {
  const { facilitySize, utilization, coolingType } = result
  const currentOption = COOLING_OPTIONS.find((c) => c.value === coolingType)!

  const alternatives = (["air", "hybrid", "liquid", "immersion"] as CoolingType[]).filter((t) => t !== coolingType)
  const [compareCoolingType, setCompareCoolingType] = useState<CoolingType>(
    () => EFFICIENCY_ORDER.find((t) => t !== coolingType)!,
  )
  const effectiveCompare = compareCoolingType === coolingType ? alternatives[0] : compareCoolingType
  const compareResult = calculate(facilitySize, utilization, effectiveCompare)

  const recoverableMw = result.strandedCapacity - compareResult.strandedCapacity
  const annualSavings = recoverableMw * HOURS_PER_YEAR * ELECTRICITY_PRICE_AVG
  const relativeSavingsPct =
    result.annualLossAvg > 0 ? ((result.annualLossAvg - compareResult.annualLossAvg) / result.annualLossAvg) * 100 : 0

  const row1Cols = singleColumn ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
  const row2Cols = singleColumn ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"

  return (
    <section className="flex flex-col gap-6">
      {/* Row: Section 1 | Section 2 */}
      <div className={`grid gap-6 ${row1Cols}`}>
        <div className={singleColumn ? "" : "lg:col-span-5"}>
          <SectionBasic result={result} option={currentOption} />
        </div>
        <div className={singleColumn ? "" : "lg:col-span-7"}>
          <SectionBreakdown result={result} />
        </div>
      </div>

      {/* Row: Section 3 | Section 4 */}
      <div className={`grid gap-6 ${row2Cols}`}>
        <SectionRadar
          result={result}
          compareResult={compareResult}
          currentLabel={COOLING_LABEL[coolingType]}
          compareLabel={COOLING_LABEL[effectiveCompare]}
          recoverableMw={recoverableMw}
          relativeSavingsPct={relativeSavingsPct}
          coolingType={coolingType}
          facilitySize={facilitySize}
          utilization={utilization}
          alternatives={alternatives}
          effectiveCompare={effectiveCompare}
          setCompareCoolingType={setCompareCoolingType}
        />
        <SectionFinancial
          result={result}
          compareLabel={COOLING_LABEL[effectiveCompare]}
          currentLabel={COOLING_LABEL[coolingType]}
          annualSavings={annualSavings}
        />
      </div>

      {/* Section 5: recommendations */}
      <SectionRecommendations
        result={result}
        compareLabel={COOLING_LABEL[effectiveCompare]}
        recoverableMw={recoverableMw}
        annualSavings={annualSavings}
      />
    </section>
  )
}

/* ================= SECTION 1 — Basic result ================= */

function SectionBasic({
  result,
  option,
}: {
  result: CalculatorResult
  option: (typeof COOLING_OPTIONS)[number]
}) {
  const { facilitySize, utilization, strandedPercent, strandedCapacity, deliveredLoad } = result
  const deliveredPct = clamp(100 - strandedPercent)

  const severity =
    strandedPercent >= 60
      ? "Estás perdiendo más de la mitad de tu capacidad instalada."
      : strandedPercent >= 35
        ? "Hay una porción considerable de tu capacidad sin aprovechar."
        : "Tu operación está relativamente eficiente, aunque queda margen."

  const highDensity = option.value === "liquid" || option.value === "immersion"

  // Gauge arc geometry (semicircle, radius 120, center 160,150)
  const frac = clamp(strandedPercent) / 100
  const startAngle = 180
  const endAngle = 180 - 180 * frac
  const toXY = (a: number) => {
    const rad = (a * Math.PI) / 180
    return { x: 160 + 120 * Math.cos(rad), y: 150 - 120 * Math.sin(rad) }
  }
  const end = toXY(endAngle)
  // El barrido va de 0° a 180° como máximo (medio círculo), nunca más:
  // el arco correcto SIEMPRE es el "menor", así que largeArc es siempre 0.
  const largeArc = 0

  // PUE reference bar scale 1.0 - 2.0 (clamped para evitar overflow si pueHigh > 2.0)
  const puePos = (p: number) => clamp(((p - 1) / 1) * 100)
  const clampRange = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
  
  return (
    <Panel className="h-full" contentClassName="gap-4">
      <div>
        <Eyebrow>Tu resultado</Eyebrow>
        <p className="mt-2 text-lg font-semibold leading-snug text-white text-balance">{severity}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/60 text-pretty">
          Con un facility de <b className="font-medium text-white">{fmtMW(facilitySize)}</b> operando al{" "}
          <b className="font-medium text-white">{utilization}%</b> sobre{" "}
          <b className="font-medium text-white">{option.label} Cooling</b>, hay{" "}
          <b className="font-medium text-white">{fmtMW(strandedCapacity)}</b> que pagás en energía y
          refrigeración pero que hoy no producen ningún cómputo — pérdida real todos los meses, no solo un número de
          eficiencia.
        </p>
      </div>

      {/* Gauge */}
      <Tile>
        <svg viewBox="0 0 320 180" width="100%" role="img" aria-label={`${strandedPercent.toFixed(0)}% de capacidad stranded`}>
          <path d="M 40 150 A 120 120 0 0 1 280 150" fill="none" stroke={TRACK} strokeWidth="22" strokeLinecap="round" />
          {frac > 0 && (
            <path
              d={`M 40 150 A 120 120 0 ${largeArc} 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
              fill="none"
              stroke={GOLD}
              strokeWidth="22"
              strokeLinecap="round"
            />
          )}
          <text x="160" y="120" textAnchor="middle" fontSize="46" fontWeight="700" fill="#ffffff">
            {strandedPercent.toFixed(0)}%
          </text>
          <text x="160" y="145" textAnchor="middle" fontSize="12.5" fill="rgba(255,255,255,0.5)">
            stranded capacity
          </text>
        </svg>

        {/* 2-segment bar delivered vs stranded */}
        <div className="mt-2 flex h-4 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full" style={{ width: `${deliveredPct}%`, background: GREEN_ACCENT }} />
          <div className="h-full" style={{ width: `${clamp(strandedPercent)}%`, background: GOLD }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: GREEN_ACCENT }}>
            {fmtMW(deliveredLoad)} usado
          </span>
          <span className="font-medium" style={{ color: GOLD }}>
            {fmtMW(strandedCapacity)} stranded
          </span>
        </div>
      </Tile>

      {/* PUE reference */}
      <Tile>
        <div className="flex items-center justify-between">
          <Eyebrow>PUE de referencia — {option.label} Cooling</Eyebrow>
          <span className="text-[10px] font-medium tracking-wide text-white/35">ESCALA 1.00 – 2.00</span>
        </div>

        <div className="relative mt-6">
          {/* Value labels */}
          <div className="relative h-4">
            {puePos(option.pueHigh) - puePos(option.pueLow) < 18 ? (
              <span
                className="absolute -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-white"
                style={{
                  left: `${clampRange((puePos(option.pueLow) + puePos(option.pueHigh)) / 2, 6, 94)}%`,
                }}
              >
                {option.pueLow.toFixed(2)}–{option.pueHigh.toFixed(2)}
              </span>
            ) : (
              <>
                <span
                  className="absolute -translate-x-1/2 text-xs font-semibold text-white"
                  style={{ left: `${clampRange(puePos(option.pueLow), 4, 96)}%` }}
                >
                  {option.pueLow.toFixed(2)}
                </span>
                <span
                  className="absolute -translate-x-1/2 text-xs font-semibold text-white"
                  style={{ left: `${clampRange(puePos(option.pueHigh), 4, 96)}%` }}
                >
                  {option.pueHigh.toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Track with minor ticks */}
          <div className="relative h-2 rounded-full bg-white/10">
            {[1.0, 1.25, 1.5, 1.75, 2.0].map((t) => (
              <div
                key={t}
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/15"
                style={{ left: `${puePos(t)}%` }}
              />
            ))}

            {/* Filled range */}
            <div
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full"
              style={{
                left: `${puePos(option.pueLow)}%`,
                width: `${Math.max(2, puePos(option.pueHigh) - puePos(option.pueLow))}%`,
                background: `linear-gradient(90deg, ${GOLD}80, ${GOLD})`,
                boxShadow: `0 0 10px 0 ${GOLD}4D`,
              }}
            />

            {/* End caps */}
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2"
              style={{ left: `${puePos(option.pueLow)}%`, background: "#0a0a0a", borderColor: GOLD }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2"
              style={{ left: `${puePos(option.pueHigh)}%`, background: "#0a0a0a", borderColor: GOLD }}
            />
          </div>

          {/* Scale labels */}
          <div className="mt-1.5 flex justify-between text-[10px] text-white/30">
            <span>1.00</span>
            <span>1.25</span>
            <span>1.50</span>
            <span>1.75</span>
            <span>2.00</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          Rango publicado (ASHRAE, Vertiv) — no es una medición exacta de tu facility.
        </p>
      </Tile>

      {/* Density context */}
      <p className="text-sm leading-relaxed text-white/60">
        {highDensity ? (
          <>
            Tu tecnología soporta alta densidad (aprox. {option.densityLow}–{option.densityHigh} kW/rack), lo esperable
            para cargas de IA, que hoy van de 50 a 120+ kW por rack.
          </>
        ) : (
          <>
            Las cargas tradicionales rondan 5–15 kW por rack y tu tecnología soporta {option.densityLow}–
            {option.densityHigh} kW/rack. Si corrés IA de alta densidad, vas a exigir el cooling muy por encima de ese
            rango.
          </>
        )}
      </p>
    </Panel>
  )
}

/* ================= SECTION 2 — Layer breakdown ================= */

function SectionBreakdown({ result }: { result: CalculatorResult }) {
  const { facilitySize: nameplate, utilization, pue } = result
  const [showCalc, setShowCalc] = useState(false)

  const layers = [
    {
      key: "facility" as const,
      label: "Facility",
      sub: "Nameplate Power",
      Icon: Building2,
      value: result.facilitySize,
      output: result.effectiveItCapacity,
      lostHere: result.facilityLossMw,
      lostBefore: 0,
      localPass: 1 / pue,
    },
    {
      key: "it" as const,
      label: "IT",
      sub: "Effective IT Capacity",
      Icon: Server,
      value: result.effectiveItCapacity,
      output: result.usableItCapacity,
      lostHere: result.itLossMw,
      lostBefore: result.facilityLossMw,
      localPass: 1 - REDUNDANCY_MARGIN,
    },
    {
      key: "workload" as const,
      label: "Workload",
      sub: "IT Work Capacity (ITWC)",
      Icon: Cpu,
      value: result.deliveredLoad,
      output: result.deliveredLoad,
      lostHere: result.workloadLossMw,
      lostBefore: result.facilityLossMw + result.itLossMw,
      localPass: utilization / 100,
    },
  ]

  return (
    <Panel className="h-full" contentClassName="gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">Capacity Flow — dónde se pierde tu capacidad</h3>
        <div className="flex gap-3 text-[11px] text-white/50">
          <Legend color={GREEN_ACCENT} label="Entregado" />
          <Legend color={GOLD} label="Perdido acá" />
          <Legend color="rgba(255,255,255,0.25)" label="Perdido antes" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {layers.map((layer, i) => {
          const greenPct = clamp((layer.output / nameplate) * 100)
          const goldPct = clamp((layer.lostHere / nameplate) * 100)
          const greyPct = clamp((layer.lostBefore / nameplate) * 100)
          const beforePct = 100 - greyPct
          const Icon = layer.Icon
          return (
            <div key={layer.key} className="flex flex-col">
              <Tile>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a94e]/10 text-[#d4a94e]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{layer.label}</p>
                    <p className="text-xs text-white/50">{layer.sub}</p>
                  </div>
                  <p className="ml-auto text-lg font-semibold tabular-nums text-white">
                    {layer.value.toFixed(2)} <span className="text-sm text-white/50">MW</span>
                  </p>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full" style={{ width: `${greenPct}%`, background: GREEN_ACCENT }} />
                  <div className="h-full" style={{ width: `${goldPct}%`, background: GOLD }} />
                  <div className="h-full" style={{ width: `${greyPct}%`, background: "rgba(255,255,255,0.2)" }} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/50">
                  <span className="font-medium" style={{ color: GOLD }}>
                    −{fmtMW(layer.lostHere)} ({goldPct.toFixed(1)}% del total)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {beforePct.toFixed(1)}% → {greenPct.toFixed(1)}% del nameplate
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Esta capa: 100% → <b className="font-medium text-white">{(layer.localPass * 100).toFixed(1)}%</b>
                  </span>
                </div>
              </Tile>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#00281b] text-white/50">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Collapsible calc explanation */}
      <div className="border-t border-white/10 pt-3">
        <button
          onClick={() => setShowCalc((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left text-xs font-medium uppercase tracking-wide text-white/50 transition hover:text-white"
          aria-expanded={showCalc}
        >
          <span>Cómo se calcula &quot;Esta capa: 100% → X%&quot;</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showCalc ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {showCalc && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full border-collapse text-left text-[11.5px]">
              <thead>
                <tr className="bg-white/5 text-white/50">
                  <th className="p-2 font-medium">Capa</th>
                  <th className="p-2 font-medium">Qué mide</th>
                  <th className="p-2 font-medium">Parámetro del modelo</th>
                  <th className="p-2 font-medium">Tu valor</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-t border-white/10">
                  <td className="p-2 font-medium text-white">Facility</td>
                  <td className="p-2 text-white/50">
                    Cuánta energía llega al IT tras el overhead de cooling
                  </td>
                  <td className="p-2 tabular-nums">1 / PUE</td>
                  <td className="p-2 tabular-nums">
                    PUE {pue} → {(100 / pue).toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-2 font-medium text-white">IT</td>
                  <td className="p-2 text-white/50">
                    Capacidad disponible tras reservar el margen de redundancia
                  </td>
                  <td className="p-2 tabular-nums">1 − margen</td>
                  <td className="p-2 tabular-nums">Margen {(REDUNDANCY_MARGIN * 100).toFixed(0)}% → 85%</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="p-2 font-medium text-white">Workload</td>
                  <td className="p-2 text-white/50">Cuánto de la capacidad disponible se usa realmente</td>
                  <td className="p-2 tabular-nums">Utilización ingresada</td>
                  <td className="p-2 tabular-nums">Tu input: {utilization}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <IndustryContext />
    </Panel>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  )
}

/* Fixed industry-context donut (does NOT react to inputs) */
function IndustryContext() {
  // inner ring r=45 (circ 282.7) — traditional greens; outer r=70 (circ 439.8) — AI golds
  return (
    <Tile>
      <div className="mb-2 flex items-center gap-2">
        <Factory className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
        <p className="text-sm font-medium text-white">Contexto de industria — dato de referencia</p>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-white/50">
        En un data center tradicional el equipo de IT concentra la mayor parte del consumo. En uno de IA, la
        infraestructura crece tanto que casi empata con el IT.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <svg viewBox="0 0 200 200" width="150" height="150" className="shrink-0" role="img" aria-label="Donut concéntrico: modelo tradicional (interior, verdes) y data center de IA (exterior, dorados)">
          {/* inner — traditional: IT 70 / Cooling 20 / Electrical 7 / Misc 3 */}
          <circle cx="100" cy="100" r="45" fill="none" stroke={GREEN_ACCENT} strokeWidth="20" strokeDasharray="197.9 84.8" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="45" fill="none" stroke={GREEN_MID} strokeWidth="20" strokeDasharray="56.5 226.2" strokeDashoffset="-197.9" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="45" fill="none" stroke={GREEN_SOFT} strokeWidth="20" strokeDasharray="19.8 262.9" strokeDashoffset="-254.5" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="45" fill="none" stroke={GREEN_PALE} strokeWidth="20" strokeDasharray="8.5 274.2" strokeDashoffset="-274.3" transform="rotate(-90 100 100)" />
          {/* outer — AI: IT 45 / Infra 55 */}
          <circle cx="100" cy="100" r="70" fill="none" stroke={GOLD_LIGHT} strokeWidth="20" strokeDasharray="197.9 241.9" transform="rotate(-90 100 100)" />
          <circle cx="100" cy="100" r="70" fill="none" stroke={GOLD} strokeWidth="20" strokeDasharray="241.9 197.9" strokeDashoffset="-197.9" transform="rotate(-90 100 100)" />
        </svg>

        <table className="min-w-[260px] flex-1 border-collapse text-[11.5px]">
          <thead>
            <tr className="text-white/50">
              <th className="p-1.5 text-left font-medium">Data center de IA</th>
              <th className="p-1.5 text-right font-medium">%</th>
              <th className="border-l border-white/10 p-1.5 pl-3 text-left font-medium">Tradicional</th>
              <th className="p-1.5 text-right font-medium">%</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            <tr>
              <td className="p-1.5">
                <Legend color={GOLD_LIGHT} label="IT Equipment" />
              </td>
              <td className="p-1.5 text-right tabular-nums">45%</td>
              <td className="border-l border-white/10 p-1.5 pl-3">
                <Legend color={GREEN_ACCENT} label="IT Equipment" />
              </td>
              <td className="p-1.5 text-right tabular-nums">70%</td>
            </tr>
            <tr>
              <td className="p-1.5">
                <Legend color={GOLD} label="Infraestructura" />
              </td>
              <td className="p-1.5 text-right tabular-nums">55%</td>
              <td className="border-l border-white/10 p-1.5 pl-3">
                <Legend color={GREEN_MID} label="Cooling" />
              </td>
              <td className="p-1.5 text-right tabular-nums">20%</td>
            </tr>
            <tr>
              <td className="p-1.5" />
              <td className="p-1.5" />
              <td className="border-l border-white/10 p-1.5 pl-3">
                <Legend color={GREEN_SOFT} label="Electrical" />
              </td>
              <td className="p-1.5 text-right tabular-nums">7%</td>
            </tr>
            <tr>
              <td className="p-1.5" />
              <td className="p-1.5" />
              <td className="border-l border-white/10 p-1.5 pl-3">
                <Legend color={GREEN_PALE} label="Misc" />
              </td>
              <td className="p-1.5 text-right tabular-nums">3%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Fuente: Uptime Institute / Schneider Electric White Paper 110. La capa Workload se mide con ITWC (IT Work
        Capacity), una métrica real de The Green Grid — no es un supuesto propio de este modelo.
      </p>
    </Tile>
  )
}

/* ================= SECTION 3 — Financial impact ================= */

function SectionFinancial({
  result,
  compareLabel,
  currentLabel,
  annualSavings,
}: {
  result: CalculatorResult
  compareLabel: string
  currentLabel: string
  annualSavings: number
}) {
  const { annualLossLow, annualLossAvg, annualLossHigh, totalFacilityCostAvg } = result
  const avgPos =
    annualLossHigh > annualLossLow ? ((annualLossAvg - annualLossLow) / (annualLossHigh - annualLossLow)) * 100 : 50
  const positiveSavings = Math.max(0, annualSavings)

  return (
    <Panel className="h-full" contentClassName="gap-5">
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
        <h3 className="text-base font-semibold text-white">Impacto financiero</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Tile>
          <p className="text-xs text-white/50">Costo total del facility</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{fmtUsd(totalFacilityCostAvg)}</p>
          <p className="mt-1 text-[11px] text-white/40">por año, a precio promedio</p>
        </Tile>
        <div className="rounded-xl p-4" style={{ background: GOLD, color: FOREST }}>
          <p className="text-xs" style={{ color: "rgba(0,58,39,0.7)" }}>De eso, se pierde</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{fmtUsd(annualLossAvg)}</p>
          <p className="mt-1 text-[11px]" style={{ color: "rgba(0,58,39,0.65)" }}>en capacidad stranded</p>
        </div>
      </div>

      {/* Range bar */}
      <Tile>
        <Eyebrow>Rango de pérdida anual</Eyebrow>
        <div className="relative mt-3 h-8">
          <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full" style={{ background: TRACK }} />
          <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full" style={{ left: "0%", right: "0%", background: GOLD }} />
          <div className="absolute top-0 h-8 w-0.5 -translate-x-1/2 rounded" style={{ left: `${clamp(avgPos)}%`, background: "#ffffff" }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
          <span>{fmtUsd(annualLossLow)}</span>
          <span className="font-medium text-white">Prom. {fmtUsd(annualLossAvg)}</span>
          <span>{fmtUsd(annualLossHigh)}</span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          El precio de la electricidad varía según región y contrato: tomamos un rango de 60 a 110 USD/MWh, con 83
          USD/MWh como valor promedio.
        </p>
      </Tile>

      {/* Projected savings */}
      <div className="rounded-xl bg-[#d4a94e]/10 p-4 ring-1 ring-[#d4a94e]/25">
        <div className="mb-3 flex items-center gap-2">
          <Coins className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
          <p className="text-sm font-medium text-white">
            Ahorro proyectado — {currentLabel} → {compareLabel}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[3, 5, 10].map((yrs) => (
            <div key={yrs} className="rounded-lg border border-white/10 bg-[#00281b] p-3 text-center">
              <p className="text-lg font-semibold tabular-nums text-[#d4a94e]">{fmtUsd(positiveSavings * yrs)}</p>
              <p className="mt-1 text-[11px] text-white/50">{yrs} años</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed context */}
      <Tile className="mt-auto">
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
          <p className="text-sm font-medium text-white">Por qué 83 USD/MWh</p>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-white/50">
          Es el benchmark de SemiAnalysis para un gran consumidor de IA — no un promedio genérico de red.
        </p>
        <table className="w-full border-collapse text-[11.5px]">
          <tbody className="text-white/80">
            {ELECTRICITY_REGIONS.map((r) => (
              <tr key={r.region} className="border-t border-white/10 first:border-t-0">
                <td className="py-1.5 text-white/50">{r.region}</td>
                <td className="py-1.5 text-right font-medium tabular-nums">~${r.price} / MWh</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-white/40">Fuentes: EIA, Eurostat, SemiAnalysis, mercado de PPA.</p>
      </Tile>
    </Panel>
  )
}

/* ================= SECTION 4 — Radar + table ================= */

function SectionRadar({
  result,
  compareResult,
  currentLabel,
  compareLabel,
  recoverableMw,
  relativeSavingsPct,
  coolingType,
  facilitySize,
  utilization,
  alternatives,
  effectiveCompare,
  setCompareCoolingType,
}: {
  result: CalculatorResult
  compareResult: CalculatorResult
  currentLabel: string
  compareLabel: string
  recoverableMw: number
  relativeSavingsPct: number
  coolingType: CoolingType
  facilitySize: number
  utilization: number
  alternatives: CoolingType[]
  effectiveCompare: CoolingType
  setCompareCoolingType: (type: CoolingType) => void
}) {
  const current = radarAxes(result)
  const comparison = radarAxes(compareResult)
  const curOpt = COOLING_OPTIONS.find((c) => c.value === result.coolingType)!
  const cmpOpt = COOLING_OPTIONS.find((c) => c.value === compareResult.coolingType)!
  const curDens = (curOpt.densityLow + curOpt.densityHigh) / 2
  const cmpDens = (cmpOpt.densityLow + cmpOpt.densityHigh) / 2

  const rows = [
    { label: "Uso eficiente", cur: `${(100 - result.strandedPercent).toFixed(1)}%`, cmp: `${(100 - compareResult.strandedPercent).toFixed(1)}%` },
    { label: "PUE", cur: result.pue.toFixed(3), cmp: compareResult.pue.toFixed(3) },
    { label: "Pérdida anual", cur: fmtUsd(result.annualLossAvg), cmp: fmtUsd(compareResult.annualLossAvg) },
    { label: "Densidad (kW/rack)", cur: `${curDens.toFixed(0)}`, cmp: `${cmpDens.toFixed(0)}` },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Selector de comparación */}
      <Panel contentClassName="flex-col gap-4 items-center sm:justify-between p-6 lg:p-6">
        <p className="text-md text-white">
          Comparar mi escenario actual{" "}
          <span className="font-semibold text-[#d4a94e]">
            ({COOLING_LABEL[coolingType]}, {fmtMW(facilitySize)}, {utilization}%)
          </span>{" "}
          contra
        </p>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#00281b] p-1">
          {alternatives.map((type) => {
            const active = effectiveCompare === type
            return (
              <button
                key={type}
                onClick={() => setCompareCoolingType(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#d4a94e] text-[#003a27] shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
                aria-pressed={active}
              >
                {COOLING_LABEL[type]}
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Panel comparativo */}
      <Panel className="h-full" contentClassName="gap-5">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-white">
            Comparativa — {currentLabel} vs {compareLabel}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          <div className="flex flex-col items-center justify-center lg:col-span-4">
            <div className="w-full max-w-xl">
              <RadarChart current={current} comparison={comparison} />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} aria-hidden="true" /> {currentLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN_ACCENT }} aria-hidden="true" /> {compareLabel}
              </span>
            </div>
          </div>

          <ul className="flex flex-col justify-center gap-2.5 text-[12px] leading-snug text-white/60 lg:col-span-3">
            <li>
              <b className="font-medium text-white">Uso eficiente</b> — % de capacidad que sí entregás.
            </li>
            <li>
              <b className="font-medium text-white">PUE</b> — eficiencia del overhead de cooling (escala fija
              1.0–2.0).
            </li>
            <li>
              <b className="font-medium text-white">Pérdida anual</b> — menor pérdida en USD (tope 20M).
            </li>
            <li>
              <b className="font-medium text-white">Densidad</b> — kW/rack soportados (tope 200).
            </li>
            <li className="pt-1 text-white">En los 4 ejes, más afuera = mejor.</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Tile>
            <p className="text-xs text-white/50">Recoverable Capacity</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[#d4a94e]">{fmtMW(recoverableMw)}</p>
          </Tile>
          <Tile>
            <p className="text-xs text-white/50">Ahorro relativo</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[#d4a94e]">{relativeSavingsPct.toFixed(1)}%</p>
          </Tile>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-white/5 text-white/50">
                <th className="p-2 font-medium">Métrica</th>
                <th className="p-2 text-right font-medium">{currentLabel}</th>
                <th className="p-2 text-right font-medium">{compareLabel}</th>
              </tr>
            </thead>
            <tbody className="text-white/80">
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-white/10">
                  <td className="p-2 text-white/50">{r.label}</td>
                  <td className="p-2 text-right font-medium tabular-nums text-white">{r.cur}</td>
                  <td className="p-2 text-right font-medium tabular-nums text-white">{r.cmp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

/* 4-axis radar (diamond), two overlaid series */
function RadarChart({
  current,
  comparison,
}: {
  current: { axis: string; value: number }[]
  comparison: { axis: string; value: number }[]
}) {
  const size = 340
  const center = size / 2
  const maxRadius = 118
  const angles = [-90, 0, 90, 180] // top, right, bottom, left

  const pointFor = (value: number, angleDeg: number) => {
    const r = (clamp(value) / 100) * maxRadius
    const rad = (angleDeg * Math.PI) / 180
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) }
  }
  const polygon = (series: { value: number }[]) =>
    series.map((s, i) => `${pointFor(s.value, angles[i]).x},${pointFor(s.value, angles[i]).y}`).join(" ")

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar comparativo de 4 ejes">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.08" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ambient glow behind everything */}
      <circle cx={center} cy={center} r={maxRadius + 24} fill="url(#radarGlow)" />

      {/* Grid rings — outer ring gets more contrast */}
      {[0.25, 0.5, 0.75, 1].map((level) => (
        <polygon
          key={level}
          points={angles
            .map((a) => {
              const r = level * maxRadius
              const rad = (a * Math.PI) / 180
              return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`
            })
            .join(" ")}
          fill="none"
          stroke={GRID_LINE}
          strokeWidth={level === 1 ? 1.25 : 1}
          strokeOpacity={level === 1 ? 0.9 : 0.5}
        />
      ))}

      {/* Spokes */}
      {angles.map((a, i) => {
        const p = pointFor(100, a)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke={GRID_LINE}
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        )
      })}

      {/* Comparison series */}
      <polygon
        points={polygon(comparison)}
        fill={GREEN_ACCENT}
        fillOpacity="0.16"
        stroke={GREEN_ACCENT}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {comparison.map((s, i) => {
        const p = pointFor(s.value, angles[i])
        return <circle key={`cmp-${s.axis}`} cx={p.x} cy={p.y} r="3.5" fill={GREEN_ACCENT} />
      })}

      {/* Current series (on top) */}
      <polygon
        points={polygon(current)}
        fill={GOLD}
        fillOpacity="0.20"
        stroke={GOLD}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {current.map((s, i) => {
        const p = pointFor(s.value, angles[i])
        return (
          <circle
            key={`cur-${s.axis}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#0a0a0a"
            stroke={GOLD}
            strokeWidth="2.5"
          />
        )
      })}

      {/* Axis labels */}
      {current.map((s, i) => {
        const labelPos = pointFor(128, angles[i])
        return (
          <text
            key={s.axis}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="13"
            fontWeight="500"
            fill="rgba(255,255,255,0.65)"
          >
            {s.axis}
          </text>
        )
      })}
    </svg>
  )
}

/* ================= SECTION 5 — Recommendations ================= */

function SectionRecommendations({
  result,
  compareLabel,
  recoverableMw,
  annualSavings,
}: {
  result: CalculatorResult
  compareLabel: string
  recoverableMw: number
  annualSavings: number
}) {
  const { strandedCapacity, facilityLossMw, coolingType, utilization } = result
  const facilityRatio = strandedCapacity > 0 ? facilityLossMw / strandedCapacity : 0
  const facilityPct = (facilityRatio * 100).toFixed(0)

  // Column 1 — Cooling Overhead
  const col1 =
    facilityRatio >= 0.45
      ? `El ${facilityPct}% de tu pérdida total está concentrada en la capa Facility, no en IT ni en Workload. Según el estudio de Vertiv+NVIDIA, migrar de Air a liquid cooling reduce el consumo de facility en 18.1% y el de los ventiladores en 80% — acá es donde una migración de tecnología rinde más.`
      : facilityRatio >= 0.25
        ? `Tu capa Facility explica una porción moderada de la pérdida (${facilityPct}%) — hay mejora disponible migrando de tecnología, pero no es tu mayor palanca.`
        : `Tu capa Facility no es el problema principal (solo ${facilityPct}% de tu pérdida total) — el cooling ya funciona relativamente bien. Las columnas de Tecnología o Utilización probablemente pesen más en tu caso.`

  // Column 2 — Technology / Density
  const positiveSavings = Math.max(0, annualSavings)
  const col2 =
    coolingType === "air" || coolingType === "hybrid"
      ? `No llegás al umbral de 50 kW/rack donde ASHRAE recomienda evaluar liquid cooling, pero cambiar de tecnología igual te devuelve capacidad recuperable — no es urgencia técnica, es oportunidad de eficiencia. Contra ${compareLabel}: ${fmtMW(recoverableMw)} recuperables (~${fmtUsd(positiveSavings)}/año).`
      : coolingType === "liquid"
        ? `Ya estás en una tecnología de alta densidad. El margen que queda es más chico, pero migrar a Immersion todavía puede sumar: contra ${compareLabel}, ${fmtMW(recoverableMw)} recuperables (~${fmtUsd(positiveSavings)}/año).`
        : `Estás en la tecnología más eficiente disponible. Acá el cooling ya no es tu palanca principal — mirá tu utilización.`

  // Column 3 — Utilization
  const col3 =
    utilization < 50
      ? `Tu utilización deja mucha capacidad ociosa sin necesidad de cambiar hardware — es la palanca más barata: mejorar el scheduling o consolidar cargas antes de invertir en nueva tecnología.`
      : utilization <= 80
        ? `Tu utilización (${utilization}%) está en un rango razonable, pero todavía hay margen operativo antes de necesitar cambios de infraestructura — mejorar el scheduling o consolidar cargas es la palanca más barata, antes de invertir en nueva tecnología de cooling.`
        : `Tu utilización ya es alta — acá el problema no es operativo, es de infraestructura. El cooling es tu próxima palanca.`

  return (
    <Panel contentClassName="gap-0">
      <h3 className="mb-5 text-base font-semibold text-white">Recomendaciones</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RecCard
          Icon={Wind}
          title="Cooling Overhead"
          body={col1}
          detail={`Umbral usado: Facility ≥45% del total perdido = alto · 25–45% = moderado · menos de 25% = bajo. Respaldo adicional del mismo estudio: Infrastructure Power −18%, IT Power −7 a −10%.`}
        />
        <RecCard
          Icon={Gauge}
          title="Tecnología / Densidad"
          body={col2}
          detail={`Umbral técnico: ASHRAE sugiere evaluar liquid cooling a partir de 50 kW/rack. La capacidad recuperable y el ahorro se calculan contra el escenario alternativo seleccionado arriba (${compareLabel}).`}
        />
        <RecCard
          Icon={Cpu}
          title="Utilización"
          body={col3}
          detail={`Umbrales: menos de 50% = mucha capacidad ociosa · 50–80% = margen operativo · más de 80% = límite de infraestructura. Tu input actual: ${utilization}%.`}
        />
      </div>
    </Panel>
  )
}

function RecCard({
  Icon,
  title,
  body,
  detail,
}: {
  Icon: LucideIcon
  title: string
  body: string
  detail: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#00281b] p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4a94e]/10 text-[#d4a94e]">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="text-[12.5px] leading-relaxed text-white/60">{body}</p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#d4a94e] transition hover:text-[#d4a94e]/80"
        aria-expanded={open}
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        Ver cómo se calculó
      </button>
      {open && <p className="mt-2 text-[11px] leading-relaxed text-white/40">{detail}</p>}
    </div>
  )
}

