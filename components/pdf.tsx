// components/pdf/FullDashboardPDF.tsx
"use client"

import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
  Line,
  Polygon,
} from "@react-pdf/renderer"
import type { CalculatorResult, CoolingType } from "@/components/capacity-calculator"
import {
  calculate,
  COOLING_OPTIONS,
  REDUNDANCY_MARGIN,
  HOURS_PER_YEAR,
  ELECTRICITY_PRICE_AVG,
} from "@/components/capacity-calculator"

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */
Font.registerHyphenationCallback((word) => [word])

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */
const GOLD = "#d4a94e"
const GOLD_DARK = "#a27e2d"
const GOLD_LIGHT = "#e8c777"
const FOREST = "#003a27"
const FOREST_DEEP = "#00281b"
const GREEN_ACCENT = "#34d399"
const GREEN_MID = "#5eead4"
const GREEN_SOFT = "#99f6e4"
const GREEN_PALE = "#d1fae5"
const TRACK = "#1a4a3a"  // Reemplazo de rgba(255,255,255,0.1)
const GRID_LINE = "#3a6a5a"  // Reemplazo de rgba(255,255,255,0.35)
const WHITE_80 = "#e0e0e0"  // rgba(255,255,255,0.8)
const WHITE_60 = "#999999"  // rgba(255,255,255,0.6)
const WHITE_50 = "#c2c2c2"  // rgba(255,255,255,0.5)
const WHITE_40 = "#979797"  // rgba(255,255,255,0.4)
const WHITE_10 = "#575757"  // rgba(255,255,255,0.1)

const COOLING_LABEL: Record<CoolingType, string> = {
  air: "Air",
  hybrid: "Hybrid",
  liquid: "Liquid",
  immersion: "Immersion",
}

const COOLING_COLORS: Record<CoolingType, string> = {
  air: "#6B8E9E",
  hybrid: "#5B8D7E",
  liquid: "#4A7B9E",
  immersion: GOLD,
}

const EFFICIENCY_ORDER: CoolingType[] = ["immersion", "liquid", "hybrid", "air"]


/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const clamp = (v: number) => Math.max(0, Math.min(100, v))
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

function radarAxes(r: CalculatorResult) {
  const opt = COOLING_OPTIONS.find((c) => c.value === r.coolingType)!
  const densAvg = (opt.densityLow + opt.densityHigh) / 2
  return [
    { axis: "Efficient usage", value: clamp(100 - r.strandedPercent) },
    { axis: "PUE", value: clamp((100 * (2.0 - r.pue)) / 1.0) },
    { axis: "Annual loss", value: clamp(100 * (1 - r.annualLossAvg / 20_000_000)) },
    { axis: "Density", value: clamp(100 * (densAvg / 200)) },
  ]
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  page: {
    backgroundColor: FOREST,
    paddingTop: 34,
    paddingBottom: 40,
    paddingHorizontal: 30,
    color: "#ffffff",
    fontFamily: "Helvetica",
  },
  headerBlock: {
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  headerMeta: {
    fontSize: 9,
    color: WHITE_50,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: FOREST_DEEP,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: WHITE_10,
  },
  title: {
    fontSize: 15,
    marginBottom: 10,
    marginTop: 10,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  eyebrow: {
    fontSize: 8,
    color: GOLD_DARK,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  text: {
    fontSize: 9.5,
    marginBottom: 4,
    color: WHITE_80,
    lineHeight: 1.5,
  },
  textSmall: {
    fontSize: 8,
    color: WHITE_50,
    lineHeight: 1.5,
  },
  textTiny: {
    fontSize: 7.5,
    color: WHITE_40,
    lineHeight: 1.5,
  },
  textBold: {
    fontSize: 10,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },
  textGold: {
    fontSize: 9,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  col2: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  col3: {
    flexDirection: "row",
    gap: 8,
  },
  col4: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tile: {
    padding: 10,
    backgroundColor: FOREST,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: WHITE_10,
    marginBottom: 8,
  },
  metricBox: {
    flex: 1,
    padding: 10,
    backgroundColor: FOREST,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: WHITE_10,
  },
  metricBoxGold: {
    flex: 1,
    padding: 10,
    backgroundColor: GOLD,
    borderRadius: 6,
  },
  metricLabel: {
    fontSize: 8,
    color: WHITE_50,
    marginBottom: 4,
  },
  metricLabelDark: {
    fontSize: 8,
    color: "#1a4a3a",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  metricValueDark: {
    fontSize: 15,
    color: FOREST,
    fontFamily: "Helvetica-Bold",
  },
  barTrack: {
    height: 8,
    backgroundColor: WHITE_10,
    borderRadius: 4,
    marginVertical: 5,
    flexDirection: "row",
    overflow: "hidden",
  },
  barFill: {
    height: 8,
  },
  table: {
    width: "100%",
    marginTop: 4,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: WHITE_10,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#0a3a2a",
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: WHITE_10,
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 8.5,
    paddingHorizontal: 6,
    color: WHITE_80,
  },
  tableCellHeader: {
    fontSize: 8,
    paddingHorizontal: 6,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  cellLeft: { flex: 2 },
  cellRight: { flex: 1, textAlign: "right" },
  legendRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  legendDotRound: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: WHITE_10,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7.5,
    color: WHITE_40,
  },
  comparisonButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: WHITE_10,
    marginRight: 4,
    marginBottom: 4,
  },
  comparisonButtonActive: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  comparisonButtonText: {
    fontSize: 8,
    color: WHITE_50,
    fontFamily: "Helvetica-Bold",
  },
  comparisonButtonTextActive: {
    color: FOREST,
  },
  radarContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  radarLabel: {
    fontSize: 8,
    color: WHITE_50,
    textAlign: "center",
    marginTop: 2,
  },
})

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function Legend({ color, label, round = false }: { color: string; label: string; round?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View style={[round ? styles.legendDotRound : styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.textSmall}>{label}</Text>
    </View>
  )
}

function PageFooter({ label }: { label: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>Full Analysis Report • {label}</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
      />
    </View>
  )
}

/* ---- Gauge (semicircle) ---- */
function GaugeSVG({ value }: { value: number }) {
  const frac = clamp(value) / 100
  const endAngle = 180 - 180 * frac
  const toXY = (a: number) => {
    const rad = (a * Math.PI) / 180
    return { x: 160 + 120 * Math.cos(rad), y: 150 - 120 * Math.sin(rad) }
  }
  const end = toXY(endAngle)

  return (
    <Svg viewBox="0 0 320 180" width={280} height={158}>
      <Path
        d="M 40 150 A 120 120 0 0 1 280 150"
        fill="none"
        stroke={TRACK}
        strokeWidth={22}
        strokeLinecap="round"
      />
      {frac > 0 && (
        <Path
          d={`M 40 150 A 120 120 0 0 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`}
          fill="none"
          stroke={GOLD}
          strokeWidth={22}
          strokeLinecap="round"
        />
      )}
      <Text x={160} y={122} textAnchor="middle" style={{ fontSize: 40 }} fill="#ffffff">
        {value.toFixed(0)}%
      </Text>
      <Text x={160} y={144} textAnchor="middle" style={{ fontSize: 11 }} fill={WHITE_50}>
        stranded capacity
      </Text>
    </Svg>
  )
}

/* ---- PUE reference range bar ---- */
function PueRangeSVG({ pueLow, pueHigh }: { pueLow: number; pueHigh: number }) {
  const w = 480
  const h = 46
  const trackY = 26
  const scale = (p: number) => clampRange(((p - 1) / 1) * w, 0, w)
  const xLow = scale(pueLow)
  const xHigh = scale(pueHigh)
  const ticks = [1.0, 1.25, 1.5, 1.75, 2.0]

  return (
    <Svg viewBox={`0 0 ${w} ${h}`} width={480} height={46}>
      <Line x1={0} y1={trackY} x2={w} y2={trackY} stroke={WHITE_10} strokeWidth={4} />
      {ticks.map((t) => (
        <Line
          key={t}
          x1={scale(t)}
          y1={trackY - 5}
          x2={scale(t)}
          y2={trackY + 5}
          stroke="#2a5a4a"
          strokeWidth={1}
        />
      ))}
      <Line x1={xLow} y1={trackY} x2={xHigh} y2={trackY} stroke={GOLD} strokeWidth={4} />
      <Circle cx={xLow} cy={trackY} r={5} fill={FOREST} stroke={GOLD} strokeWidth={2} />
      <Circle cx={xHigh} cy={trackY} r={5} fill={FOREST} stroke={GOLD} strokeWidth={2} />
      <Text x={xLow} y={trackY - 12} textAnchor="middle" style={{ fontSize: 9 }} fill="#ffffff">
        {pueLow.toFixed(2)}
      </Text>
      <Text x={xHigh} y={trackY - 12} textAnchor="middle" style={{ fontSize: 9 }} fill="#ffffff">
        {pueHigh.toFixed(2)}
      </Text>
      {ticks.map((t) => (
        <Text key={`lbl-${t}`} x={scale(t)} y={h - 2} textAnchor="middle" style={{ fontSize: 7.5 }} fill={WHITE_40}>
          {t.toFixed(2)}
        </Text>
      ))}
    </Svg>
  )
}

/* ---- Radar chart comparativo (dos series) SIN FONDO OSCURO - TAMAÑO REDUCIDO ---- */
function RadarChartSVG({
  current,
  comparison,
  currentLabel,
  compareLabel,
  currentColor = GOLD,
  compareColor = GREEN_ACCENT,
}: {
  current: { axis: string; value: number }[]
  comparison: { axis: string; value: number }[]
  currentLabel?: string
  compareLabel?: string
  currentColor?: string
  compareColor?: string
}) {
  const size = 220
  const center = size / 2
  const maxRadius = 70
  const angles = [-90, 0, 90, 180]

  const pointFor = (value: number, angleDeg: number) => {
    const r = (clamp(value) / 100) * maxRadius
    const rad = (angleDeg * Math.PI) / 180
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) }
  }

  const polygon = (series: { value: number }[]) =>
    series.map((s, i) => `${pointFor(s.value, angles[i]).x},${pointFor(s.value, angles[i]).y}`).join(" ")

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Svg viewBox={`0 0 ${size} ${size}`} width={210} height={210}>
        {/* Grid rings - gris claro sin fondo */}
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <Polygon
            key={level}
            points={angles
              .map((a) => {
                const r = level * maxRadius
                const rad = (a * Math.PI) / 180
                return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`
              })
              .join(" ")}
            fill="none"
            stroke="#1a4a3a"
            strokeWidth={level === 1 ? 0.8 : 0.5}
          />
        ))}

        {/* Spokes - gris */}
        {angles.map((a, i) => {
          const p = pointFor(100, a)
          return <Line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#0a3a2a" strokeWidth={0.5} />
        })}

        {/* Comparison series */}
        <Polygon points={polygon(comparison)} fill={compareColor} fillOpacity={0.12} stroke={compareColor} strokeWidth={1.5} />
        {comparison.map((s, i) => {
          const p = pointFor(s.value, angles[i])
          return <Circle key={`cmp-${s.axis}`} cx={p.x} cy={p.y} r={2.5} fill={compareColor} />
        })}

        {/* Current series */}
        <Polygon points={polygon(current)} fill={currentColor} fillOpacity={0.15} stroke={currentColor} strokeWidth={2} />
        {current.map((s, i) => {
          const p = pointFor(s.value, angles[i])
          return <Circle key={`cur-${s.axis}`} cx={p.x} cy={p.y} r={3} fill="transparent" stroke={currentColor} strokeWidth={2} />
        })}

        {/* Axis labels - más pequeños */}
        {current.map((s, i) => {
          const labelPos = pointFor(88, angles[i])
          return (
            <Text key={s.axis} x={labelPos.x} y={labelPos.y} textAnchor="middle" style={{ fontSize: 6.5 }} fill={WHITE_50}>
              {s.axis === "Efficient usage" ? "Usage" : s.axis === "Annual loss" ? "Loss" : s.axis}
            </Text>
          )
        })}

        {/* Título de comparación fuera del SVG */}
      {currentLabel && compareLabel && (
        <Text x={center} y={size-8}  textAnchor="middle" style={{ fontSize: 8, width: 210 }} fill={WHITE_50}>
          {`${currentLabel} vs ${compareLabel}`}
        </Text>
      )}
      </Svg>
    </div>
  )
}

/* ---- All-variants comparison table ---- */
function AllVariantsComparison({
  result,
  allResults,
}: {
  result: CalculatorResult
  allResults: { type: CoolingType; result: CalculatorResult }[]
}) {
  const sorted = [...allResults].sort((a, b) => {
    const idxA = EFFICIENCY_ORDER.indexOf(a.type)
    const idxB = EFFICIENCY_ORDER.indexOf(b.type)
    return idxA - idxB
  })

  const rows = sorted.map(({ type, result: r }) => {
    const label = COOLING_LABEL[type]
    const isCurrent = type === result.coolingType
    const opt = COOLING_OPTIONS.find((c) => c.value === type)!
    const densAvg = (opt.densityLow + opt.densityHigh) / 2
    const efficientUsage = 100 - r.strandedPercent
    const recoverableFromCurrent = Math.max(0, result.strandedCapacity - r.strandedCapacity)
    const savings = recoverableFromCurrent * HOURS_PER_YEAR * ELECTRICITY_PRICE_AVG

    return {
      label,
      isCurrent,
      efficientUsage: efficientUsage.toFixed(1),
      pue: r.pue.toFixed(3),
      annualLoss: fmtUsd(r.annualLossAvg),
      density: densAvg.toFixed(0),
      recoverable: fmtMW(recoverableFromCurrent),
      savings: fmtUsd(Math.max(0, savings)),
    }
  })

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCellHeader, styles.cellLeft]}>Cooling Type</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Efficient Usage</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>PUE</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Annual Loss</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Density (kW/rack)</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Recoverable</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Savings</Text>
      </View>
      {rows.map((row) => (
        <View
          key={row.label}
          style={[
            styles.tableRow,
            row.isCurrent ? { backgroundColor: "#1a4a2a" } : {},
          ]}
        >
          <Text
            style={[
              styles.tableCell,
              styles.cellLeft,
              row.isCurrent ? { color: GOLD, fontFamily: "Helvetica-Bold" } : {},
            ]}
          >
            {row.label}{row.isCurrent ? " ✓" : ""}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.efficientUsage}%</Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.pue}</Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.annualLoss}</Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.density}</Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.recoverable}</Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>{row.savings}</Text>
        </View>
      ))}
    </View>
  )
}

/* ---- All Radars Comparison (todos los radares comparativos) ---- */
function AllRadarsComparison({
  allVariants,
  currentType,
  currentResult,
}: {
  allVariants: { type: CoolingType; result: CalculatorResult }[]
  currentType: CoolingType
  currentResult: CalculatorResult
}) {
  const sorted = [...allVariants].sort((a, b) => {
    const idxA = EFFICIENCY_ORDER.indexOf(a.type)
    const idxB = EFFICIENCY_ORDER.indexOf(b.type)
    return idxA - idxB
  })

  const currentData = radarAxes(currentResult)
  const currentLabel = COOLING_LABEL[currentType]

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 8, gap: 2 }}>
      {sorted.map(({ type, result: r }) => {
        const isCurrent = type === currentType
        if (isCurrent) return null // No mostrar el current contra sí mismo
        
        const compareData = radarAxes(r)
        const label = COOLING_LABEL[type]
        const color = COOLING_COLORS[type] || WHITE_50
        
        return (
          <View
            key={type}
            style={{
              alignItems: "center",
              flex: 1,
              maxWidth: "33%",
              minWidth: "30%",
            }}
          >
            <RadarChartSVG 
              current={currentData} 
              comparison={compareData}
              currentLabel={currentLabel}
              compareLabel={label}
              currentColor={GOLD}
              compareColor={color}
            />
          </View>
        )
      })}
    </View>
  )
}

/* ---- All Savings Comparison ---- */
function AllSavingsComparison({
  currentResult,
  allVariants,
}: {
  currentResult: CalculatorResult
  allVariants: { type: CoolingType; result: CalculatorResult }[]
  currentLabel: string
}) {
  const sorted = [...allVariants].sort((a, b) => {
    const idxA = EFFICIENCY_ORDER.indexOf(a.type)
    const idxB = EFFICIENCY_ORDER.indexOf(b.type)
    return idxA - idxB
  })

  const savingsData = sorted.map(({ type, result: r }) => {
    const isCurrent = type === currentResult.coolingType
    const recoverableMw = Math.max(0, currentResult.strandedCapacity - r.strandedCapacity)
    const annualSavings = recoverableMw * HOURS_PER_YEAR * ELECTRICITY_PRICE_AVG
    const label = COOLING_LABEL[type]
    
    return {
      label,
      isCurrent,
      recoverable: fmtMW(recoverableMw),
      annualSavings: fmtUsd(Math.max(0, annualSavings)),
      threeYear: fmtUsd(Math.max(0, annualSavings * 3)),
      fiveYear: fmtUsd(Math.max(0, annualSavings * 5)),
      tenYear: fmtUsd(Math.max(0, annualSavings * 10)),
    }
  })

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCellHeader, styles.cellLeft]}>Cooling Type</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Recoverable</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>Annual</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>3 Years</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>5 Years</Text>
        <Text style={[styles.tableCellHeader, styles.cellRight]}>10 Years</Text>
      </View>
      {savingsData.map((row) => (
        <View
          key={row.label}
          style={[
            styles.tableRow,
            row.isCurrent ? { backgroundColor: "#1a4a2a" } : {},
          ]}
        >
          <Text
            style={[
              styles.tableCell,
              styles.cellLeft,
              row.isCurrent ? { color: GOLD, fontFamily: "Helvetica-Bold" } : {},
            ]}
          >
            {row.label}{row.isCurrent ? " ✓" : ""}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>
            {row.recoverable}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>
            {row.annualSavings}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>
            {row.threeYear}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>
            {row.fiveYear}
          </Text>
          <Text style={[styles.tableCell, styles.cellRight, row.isCurrent ? { color: GOLD } : {}]}>
            {row.tenYear}
          </Text>
        </View>
      ))}
    </View>
  )
}

/* ------------------------------------------------------------------ */
/*  Main document — TODAS las secciones en un UNICO VIEW             */
/* ------------------------------------------------------------------ */

export function FullDashboardPDF({ result }: { result: CalculatorResult }) {
  const { facilitySize, utilization, coolingType, strandedPercent, strandedCapacity, deliveredLoad, pue } = result
  const currentOption = COOLING_OPTIONS.find((c) => c.value === coolingType)!
  const deliveredPct = clamp(100 - strandedPercent)

  const allVariants = (["air", "hybrid", "liquid", "immersion"] as CoolingType[]).map((type) => ({
    type,
    result: calculate(facilitySize, utilization, type),
  }))

  const effectiveCompare = EFFICIENCY_ORDER.find((t) => t !== coolingType) ?? "immersion"
  const compareResult = allVariants.find((v) => v.type === effectiveCompare)!.result
  const compareLabel = COOLING_LABEL[effectiveCompare]
  const currentLabel = COOLING_LABEL[coolingType]

  const recoverableMw = result.strandedCapacity - compareResult.strandedCapacity
  const annualSavings = recoverableMw * HOURS_PER_YEAR * ELECTRICITY_PRICE_AVG
  const positiveSavings = Math.max(0, annualSavings)
  const avgPos =
    result.annualLossHigh > result.annualLossLow
      ? ((result.annualLossAvg - result.annualLossLow) / (result.annualLossHigh - result.annualLossLow)) * 100
      : 50

  const severity =
    strandedPercent >= 60
      ? "You're losing more than half of your installed capacity."
      : strandedPercent >= 35
        ? "A considerable portion of your capacity is going unused."
        : "Your operation is relatively efficient, though there's still room for improvement."

  const highDensity = coolingType === "liquid" || coolingType === "immersion"

  const layers = [
    {
      label: "Facility",
      sub: "Nameplate Power",
      value: result.facilitySize,
      output: result.effectiveItCapacity,
      lostHere: result.facilityLossMw,
      lostBefore: 0,
      localPass: 1 / pue,
      calcLabel: "1 / PUE",
      calcValue: `PUE ${pue.toFixed(2)} → ${(100 / pue).toFixed(1)}%`,
      calcDesc: "How much power reaches IT after cooling overhead",
    },
    {
      label: "IT",
      sub: "Effective IT Capacity",
      value: result.effectiveItCapacity,
      output: result.usableItCapacity,
      lostHere: result.itLossMw,
      lostBefore: result.facilityLossMw,
      localPass: 1 - REDUNDANCY_MARGIN,
      calcLabel: "1 − margin",
      calcValue: `Margin ${(REDUNDANCY_MARGIN * 100).toFixed(0)}% → 85%`,
      calcDesc: "Available capacity after reserving redundancy margin",
    },
    {
      label: "Workload",
      sub: "IT Work Capacity (ITWC)",
      value: result.deliveredLoad,
      output: result.deliveredLoad,
      lostHere: result.workloadLossMw,
      lostBefore: result.facilityLossMw + result.itLossMw,
      localPass: utilization / 100,
      calcLabel: "Entered utilization",
      calcValue: `Your input: ${utilization}%`,
      calcDesc: "How much of the available capacity is actually used",
    },
  ]

  const facilityRatio = result.strandedCapacity > 0 ? result.facilityLossMw / result.strandedCapacity : 0
  const facilityPct = (facilityRatio * 100).toFixed(0)

  const col1 =
    facilityRatio >= 0.45
      ? `${facilityPct}% of your total loss is concentrated in the Facility layer, not in IT or Workload. According to the Vertiv+NVIDIA study, migrating from Air to liquid cooling reduces facility consumption by 18.1% and fan power by 80% — this is where technology migration delivers the most value.`
      : facilityRatio >= 0.25
        ? `Your Facility layer accounts for a moderate portion of the loss (${facilityPct}%) — there's improvement available by migrating technology, but it's not your biggest lever.`
        : `Your Facility layer is not the main problem (only ${facilityPct}% of your total loss) — cooling is already working relatively well. The Technology or Utilization columns likely carry more weight in your case.`

  const col2 =
    coolingType === "air" || coolingType === "hybrid"
      ? `You're not reaching the 50 kW/rack threshold where ASHRAE recommends evaluating liquid cooling, but changing technology still recovers capacity — it's not a technical urgency, it's an efficiency opportunity. Against ${compareLabel}: ${fmtMW(recoverableMw)} recoverable (~${fmtUsd(positiveSavings)}/year).`
      : coolingType === "liquid"
        ? `You're already on high-density technology. The remaining margin is smaller, but migrating to Immersion can still add value: against ${compareLabel}, ${fmtMW(recoverableMw)} recoverable (~${fmtUsd(positiveSavings)}/year).`
        : `You're on the most efficient technology available. Cooling is no longer your main lever — look at your utilization.`

  const col3 =
    utilization < 50
      ? `Your utilization leaves a lot of idle capacity without needing hardware changes — it's the cheapest lever: improve scheduling or consolidate workloads before investing in new technology.`
      : utilization <= 80
        ? `Your utilization (${utilization}%) is in a reasonable range, but there's still operational headroom before infrastructure changes are needed — improving scheduling or consolidating workloads is the cheapest lever, before investing in new cooling technology.`
        : `Your utilization is already high — the problem here isn't operational, it's infrastructure. Cooling is your next lever.`

  const generatedOn = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  return (
    <Document
      title="Full Analysis Report"
      author="Capacity Waste Calculator"
      subject={`Capacity analysis — ${fmtMW(facilitySize)}, ${utilization}% utilization, ${currentOption.label} cooling`}
    >
      <Page size="A4" style={styles.page} wrap>
        {/* ===== UNICO VIEW con TODAS las secciones ===== */}
        <View>
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>Full Analysis</Text>
            <Text style={styles.headerMeta}>
              Generated on {generatedOn} · {fmtMW(facilitySize)} facility · {utilization}% utilization · {currentOption.label} cooling
            </Text>
          </View>

          {/* SECCIÓN 1 — Your Result */}
          <View>
            <Text style={styles.title}>Your Result</Text>
            <Text style={[styles.text, { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: "#ffffff" }]}>
              {severity}
            </Text>
            <Text style={styles.text}>
              With a facility of {fmtMW(facilitySize)} operating at {utilization}% using {currentOption.label} Cooling,
              there's {fmtMW(strandedCapacity)} that you're paying for in energy and cooling but that isn't producing
              any compute today — a real loss every month, not just an efficiency number.
            </Text>

            <View style={[styles.tile, { alignItems: "center", marginTop: 8 }]}>
              <GaugeSVG value={strandedPercent} />
              <View style={{ width: "100%" }}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${deliveredPct}%`, backgroundColor: GREEN_ACCENT }]} />
                  <View style={[styles.barFill, { width: `${clamp(strandedPercent)}%`, backgroundColor: GOLD }]} />
                </View>
                <View style={styles.row}>
                  <Text style={[styles.textGold, { color: GREEN_ACCENT }]}>{fmtMW(deliveredLoad)} used</Text>
                  <Text style={styles.textGold}>{fmtMW(strandedCapacity)} stranded</Text>
                </View>
              </View>
            </View>

            <View style={styles.tile}>
              <View style={styles.row}>
                <Text style={styles.eyebrow}>Reference PUE — {currentOption.label} Cooling</Text>
                <Text style={[styles.textTiny, { letterSpacing: 0.5 }]}>SCALE 1.00 – 2.00</Text>
              </View>
              <View style={{ alignItems: "center", marginTop: 4 }}>
                <PueRangeSVG pueLow={currentOption.pueLow} pueHigh={currentOption.pueHigh} />
              </View>
              <Text style={styles.textTiny}>
                Published range (ASHRAE, Vertiv) — not an exact measurement of your facility.
              </Text>
            </View>

            <Text style={styles.text}>
              {highDensity ? (
                `Your technology supports high density (approx. ${currentOption.densityLow}–${currentOption.densityHigh} kW/rack), which is expected for AI workloads that today range from 50 to 120+ kW per rack.`
              ) : (
                `Traditional workloads run around 5–15 kW per rack and your technology supports ${currentOption.densityLow}–${currentOption.densityHigh} kW/rack. If you're running high-density AI, you'll push the cooling system far beyond that range.`
              )}
            </Text>
          </View>

          {/* SECCIÓN 2 — Capacity Flow */}
          <View>
            <View style={styles.row}>
              <Text style={styles.title}>Capacity Flow — where your capacity is lost</Text>
            </View>
            <View style={[styles.legendRow, { marginTop: -4 }]}>
              <Legend color={GREEN_ACCENT} label="Delivered" />
              <Legend color={GOLD} label="Lost here" />
              <Legend color="#4a6a5a" label="Lost before" />
            </View>

            {layers.map((layer, i) => {
              const greenPct = clamp((layer.output / facilitySize) * 100)
              const goldPct = clamp((layer.lostHere / facilitySize) * 100)
              const greyPct = clamp((layer.lostBefore / facilitySize) * 100)
              const beforePct = 100 - greyPct
              return (
                <View key={i} style={styles.tile} wrap={false}>
                  <View style={styles.row}>
                    <View>
                      <Text style={styles.textBold}>{layer.label}</Text>
                      <Text style={styles.textSmall}>{layer.sub}</Text>
                    </View>
                    <Text style={styles.textGold}>{layer.value.toFixed(2)} MW</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${greenPct}%`, backgroundColor: GREEN_ACCENT }]} />
                    <View style={[styles.barFill, { width: `${goldPct}%`, backgroundColor: GOLD }]} />
                    <View style={[styles.barFill, { width: `${greyPct}%`, backgroundColor: "#2a5a4a" }]} />
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.textSmall, { color: GOLD }]}>
                      −{fmtMW(layer.lostHere)} ({goldPct.toFixed(1)}% of total)
                    </Text>
                    <Text style={styles.textSmall}>
                      {beforePct.toFixed(1)}% → {greenPct.toFixed(1)}% of nameplate
                    </Text>
                  </View>
                  <Text style={[styles.textTiny, { marginTop: 3 }]}>
                    {layer.calcDesc} · {layer.calcLabel} · {layer.calcValue} · This layer: 100% →{" "}
                    {(layer.localPass * 100).toFixed(1)}%
                  </Text>
                </View>
              )
            })}
          </View>

          {/* SECCIÓN 3 — Financial Impact con TODAS las comparaciones */}
          <View>
            <Text style={styles.title}>Financial Impact</Text>

            <View style={styles.col2}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Total facility cost</Text>
                <Text style={styles.metricValue}>{fmtUsd(result.totalFacilityCostAvg)}</Text>
                <Text style={styles.textTiny}>per year, at average price</Text>
              </View>
              <View style={styles.metricBoxGold}>
                <Text style={styles.metricLabelDark}>Of that, lost</Text>
                <Text style={styles.metricValueDark}>{fmtUsd(result.annualLossAvg)}</Text>
                <Text style={[styles.textTiny, { color: "#1a4a3a" }]}>in stranded capacity</Text>
              </View>
            </View>

            <View style={styles.tile}>
              <Text style={styles.eyebrow}>Annual loss range</Text>
              <View style={{ marginTop: 4 }}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: "100%", backgroundColor: GOLD }]} />
                </View>
                <View
                  style={{
                    position: "absolute",
                    left: `${clamp(avgPos)}%`,
                    top: 0,
                    width: 2,
                    height: 8,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.textSmall}>{fmtUsd(result.annualLossLow)}</Text>
                <Text style={[styles.textSmall, { color: GOLD, fontFamily: "Helvetica-Bold" }]}>
                  Avg. {fmtUsd(result.annualLossAvg)}
                </Text>
                <Text style={styles.textSmall}>{fmtUsd(result.annualLossHigh)}</Text>
              </View>
              <Text style={styles.textTiny}>
                Electricity prices vary by region and contract: we use a range of 60 to 110 USD/MWh, with 83 USD/MWh
                as the average.
              </Text>
            </View>

            {/* TODAS las comparaciones de ahorro */}
            <View>
              <Text style={[styles.textBold, { marginBottom: 6 }]}>
                Projected savings — {currentLabel} vs all alternatives
              </Text>
              <AllSavingsComparison 
                currentResult={result} 
                allVariants={allVariants}
                currentLabel={currentLabel}
              />
            </View>
          </View>

          {/* SECCIÓN 4 — Comparison (Todos los radares comparativos) */}
          <View>
            <Text style={styles.title}>Comparison — All Cooling Technologies</Text>
            <Text style={styles.text}>
              Comparing your current scenario ({currentLabel}, {fmtMW(facilitySize)}, {utilization}%) against all
              available cooling technologies at the same facility size and utilization.
            </Text>

            {/* TODOS los radares comparativos (current vs cada alternativa) */}
            <AllRadarsComparison 
              allVariants={allVariants} 
              currentType={coolingType}
              currentResult={result}
            />
          </View>

          {/* SECCIÓN 6 — Complete Comparison All Technologies */}
          <View>
            <Text style={[styles.title, { fontSize: 13 }]}>Complete Comparison — All Technologies</Text>
            <Text style={[styles.textSmall, { marginBottom: 6 }]}>
              ✓ indicates your current selection. Recoverable and Savings are calculated relative to your current scenario.
            </Text>
            <AllVariantsComparison result={result} allResults={allVariants} />
            <Text style={[styles.textTiny, { marginTop: 6 }]}>
              Density is the average of the published low-high range for each cooling type. Savings are annual at 83 USD/MWh.
            </Text>
          </View>

          {/* SECCIÓN 7 — Recommendations */}
          <View>
            <Text style={styles.title}>Recommendations</Text>

            <View style={styles.tile} wrap={false}>
              <Text style={styles.textBold}>Cooling Overhead</Text>
              <Text style={[styles.text, { marginTop: 4 }]}>{col1}</Text>
              <Text style={styles.textTiny}>
                Threshold used: Facility ≥45% of total lost = high · 25–45% = moderate · less than 25% = low.
                Additional support from the same study: Infrastructure Power −18%, IT Power −7 to −10%.
              </Text>
            </View>

            <View style={styles.tile} wrap={false}>
              <Text style={styles.textBold}>Technology / Density</Text>
              <Text style={[styles.text, { marginTop: 4 }]}>{col2}</Text>
              <Text style={styles.textTiny}>
                Technical threshold: ASHRAE suggests evaluating liquid cooling starting at 50 kW/rack. Recoverable
                capacity and savings are calculated against the alternative scenario selected above ({compareLabel}).
              </Text>
            </View>

            <View style={[styles.tile, { marginBottom: 0 }]} wrap={false}>
              <Text style={styles.textBold}>Utilization</Text>
              <Text style={[styles.text, { marginTop: 4 }]}>{col3}</Text>
              <Text style={styles.textTiny}>
                Thresholds: less than 50% = significant idle capacity · 50–80% = operational headroom · more than 80%
                = infrastructure limit. Your current input: {utilization}%.
              </Text>
            </View>
          </View>
        </View>

        <PageFooter label="Complete Analysis" />
      </Page>
    </Document>
  )
}