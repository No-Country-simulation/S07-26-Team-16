"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { CalculatorResult } from "@/components/capacity-calculator"
import {
  TrendingDown,
  ArrowRight,
  BarChart3,
  Layers,
  FileDown,
  Lightbulb,
  X,
  DollarSign,
  Building2,
  Server,
  Cpu,
  ArrowDown,
  type LucideIcon
} from "lucide-react"

const Model = dynamic(() => import("@/components/model"), {
  ssr: false,
  loading: () => <div className="flex justify-center h-full w-full" />,
})

const BENEFITS = [
  { label: "Compare cooling scenarios", icon: BarChart3 },
  { label: "Layer-by-layer breakdown", icon: Layers },
  { label: "Download PDF report", icon: FileDown },
  { label: "Tailored recommendations", icon: Lightbulb },
]

const COOLING_LABEL: Record<string, string> = {
  air: "Air cooling",
  hybrid: "Hybrid cooling",
  liquid: "Liquid cooling",
  immersion: "Immersion cooling",
}

function formatMw(value: number) {
  return `${value.toFixed(1)} MW`
}

function formatUsd(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`
  return `$${Math.round(value)}`
}

function CountUp({
  value,
  decimals = 0,
  duration = 1200,
  suffix = "",
  prefix = "",
}: {
  value: number
  decimals?: number
  duration?: number
  suffix?: string
  prefix?: string
}) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    }
  }, [value, duration])

  return (
    <>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </>
  )
}

function CountUpUsd({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(value * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    }
  }, [value, duration])

  return <>{formatUsd(display)}</>
}

function FunnelLayer({
  icon: Icon,
  label,
  caption,
  value,
  pct,
  emphasis,
}: {
  icon: LucideIcon
  label: string
  caption: string
  value: string
  pct: number
  emphasis?: boolean
}) {
  const width = Math.max(pct, 34)

  return (
    <div 
      className="flex w-full flex-col items-center sm:w-[var(--layer-width)] transition-all duration-300"
      style={{ "--layer-width": `${width}%` } as React.CSSProperties}
    >
      <div
        className="flex w-full items-center gap-3 rounded-xl p-3 sm:p-4 transition-all"
        style={{
          border: emphasis ? "1px solid #d4a94e" : "1px solid rgba(26,107,79,0.5)",
          background: emphasis ? "rgba(212,169,78,0.12)" : "rgba(0,30,20,0.55)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9"
          style={{
            background: emphasis
              ? "linear-gradient(135deg, #a27e2d, #d4a94e)"
              : "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
            border: "1px solid rgba(212,169,78,0.35)",
            color: "#ffffff",
          }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-white">{label}</span>
            <span className="text-xs sm:text-sm font-semibold" style={{ color: "#d4a94e" }}>
              {value}
            </span>
          </div>
          <p className="truncate text-[10px] sm:text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {caption}
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: emphasis
                  ? "linear-gradient(90deg, #a27e2d, #d4a94e)"
                  : "#1a6b4f",
              }}
            />
          </div>
        </div>
      </div>
      <span className="mt-1 text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
        {pct.toFixed(0)}% of nameplate
      </span>
    </div>
  )
}

interface ResultPanelProps {
  result: CalculatorResult | null
  onUnlock?: (email: string) => void
}

export function ResultPanel({ result, onUnlock }: ResultPanelProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setModalOpen(false)
    onUnlock?.(email)
  }

  if (!result) {
    return (
<div className="relative flex h-full w-full min-h-0 flex-col items-center lg:items-end justify-between overflow-hidden gap-6 lg:gap-0">
        <div className="absolute inset-0 z-0 pointer-events-none" suppressHydrationWarning>
          {/*<Model />*/}
        </div>

        {/* Bloque de marca */}
        <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center rounded-2xl bg-black/40 p-4 text-center backdrop-blur-md lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span style={{ color: "#0d4a34" }}>Physa</span>
            <span style={{ color: "#c9a44c" }}>Flow</span>
          </h1>
          <p
            className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.2em] sm:text-[10px]"
            style={{ color: "#c9a44c" }}
          >
            Nature-Inspired Frontier AI Networks 
          </p>
          <div className="flex md:flex items-center gap-4 p-4">
            <a
              href="https://dev.physaflow.com/login"
              className="group relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 bg-[linear-gradient(135deg,#a27e2d,#d4a94e)] shadow-[0_4px_20px_rgba(162,126,45,0.35)]"
            >
              <span className="relative z-10">Platform Login</span>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(135deg,#d4a94e,#a27e2d)]" />
            </a>
          </div>
        </div>

        {/* Contenedor de texto */}
        <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center justify-center rounded-2xl bg-black/40 p-4 text-center backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Your stranded
            <br />
            <span className="animate-shimmer">capacity results</span>
            <br />
            will appear here
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground text-pretty">
            Enter your facility size, utilization and cooling strategy, then run the calculator to reveal the hidden
            capacity you are paying for but not using.
          </p>
        </div>
      </div>
    )
  }

  // Cálculos de capas traídos del nuevo componente
  const facilityPct = 100
  const itPct = result.facilitySize > 0 ? (result.usableItCapacity / result.facilitySize) * 100 : 0
  const workloadPct = result.facilitySize > 0 ? (result.deliveredLoad / result.facilitySize) * 100 : 0

  const layers = [
    {
      key: "facility",
      label: "Facility",
      caption: "Nameplate power",
      value: result.facilitySize,
      pct: facilityPct,
      icon: Building2,
    },
    {
      key: "it",
      label: "IT",
      caption: "Usable after cooling + redundancy",
      value: result.usableItCapacity,
      pct: itPct,
      icon: Server,
    },
    {
      key: "workload",
      label: "Workload",
      caption: "Actually delivered load",
      value: result.deliveredLoad,
      pct: workloadPct,
      icon: Cpu,
    },
  ]

  return (
    <section className="flex h-full w-full min-h-0 flex-col justify-center overflow-hidden">
      <div
        className="group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl p-px transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(212,169,78,0.6), rgba(162,126,45,0.2), rgba(26,107,79,0.3))",
        }}
      >
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col justify-between gap-2 overflow-y-auto rounded-2xl sm:gap-3 p-4 md:p-6 bg-[#003a27]/90">
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(circle at 20% 20%, rgba(212,169,78,0.07) 0%, transparent 60%)" }}
          />

          {/* Header */}
          <div className="relative flex shrink-0 items-center justify-between gap-2">
            <div>
              <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-widest" style={{ color: "#a27e2d" }}>
                Instant estimate
              </span>
              <h2 className="text-sm sm:text-base font-bold" style={{ color: "#ffffff" }}>
                Based on your facility inputs
              </h2>
            </div>
            <span
              className="rounded-lg px-2.5 py-1 text-xs font-medium shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                border: "1px solid rgba(212,169,78,0.35)",
                color: "#d4a94e",
              }}
            >
              {COOLING_LABEL[result.coolingType] || result.coolingType}
            </span>
          </div>

          {/* KPIs */}
          <div className="relative grid shrink-0 grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
            {/* KPI 1: Stranded Capacity */}
            <div
              className="rounded-xl p-3 flex flex-col justify-between gap-2 sm:p-4 sm:gap-3"
              style={{ border: "1px solid rgba(26,107,79,0.5)", background: "rgba(0,30,20,0.55)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                    border: "1px solid rgba(212,169,78,0.35)",
                  }}
                >
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" style={{ color: "#d4a94e" }} />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Estimated Stranded Capacity
                </p>
              </div>

              <div className="flex items-baseline justify-between gap-2 flex-wrap sm:flex-nowrap">
                <p
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none"
                  style={{
                    background: "linear-gradient(135deg, #a27e2d, #d4a94e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <CountUp value={result.strandedPercent} decimals={0} />
                  <span className="text-xl sm:text-2xl ml-0.5">%</span>
                </p>

                <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(212,169,78,0.1)", border: "1px solid rgba(212,169,78,0.25)", color: "#ffffff" }}>
                  <CountUp value={result.strandedCapacity} decimals={1} suffix=" MW" />
                  <span style={{ color: "#d4a94e" }}>lost</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Annual Loss */}
            <div
              className="flex flex-col justify-between gap-2 rounded-xl p-3 sm:gap-3 sm:p-4"
              style={{
                background: "linear-gradient(135deg, rgba(162,126,45,0.25), rgba(0,58,39,0.9))",
                border: "1px solid rgba(212,169,78,0.35)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                    border: "1px solid rgba(212,169,78,0.35)",
                  }}
                >
                  <DollarSign className="h-3.5 w-3.5" aria-hidden="true" style={{ color: "#d4a94e" }} />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Estimated Annual Loss
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none flex items-center gap-1.5 flex-wrap" style={{ color: "#ffffff" }}>
                  <CountUpUsd value={result.annualLossLow} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8em" }}>–</span>
                  <CountUpUsd value={result.annualLossHigh} />
                </p>
                <p className="mt-1.5 text-[11px] leading-tight" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Per year in power contracts and amortized capex on idle capacity
                </p>
              </div>
            </div>
          </div>

          {/* Signature capacity cascade (Integrated Funnel) */}
          <div
            className="relative flex flex-1 min-h-0 flex-col justify-center overflow-hidden rounded-xl p-3 sm:p-4"
            style={{ border: "1px solid rgba(26,107,79,0.5)", background: "rgba(0,30,20,0.55)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex shrink-0 items-center justify-between">
              <p className="text-xs font-medium" style={{ color: "#ffffff" }}>
                How capacity is lost, layer by layer
              </p>
            </div>
            
            <div className="flex flex-col items-center w-full py-1">
              {layers.map((layer, i) => {
                const Icon = layer.icon
                const isLast = i === layers.length - 1
                return (
                  <div key={layer.key} className="flex w-full flex-col items-center">
                    <FunnelLayer
                      icon={Icon}
                      label={layer.label}
                      caption={layer.caption}
                      value={formatMw(layer.value)}
                      pct={layer.pct}
                      emphasis={isLast}
                    />
                    {!isLast && (
                      <div className="flex h-6 items-center justify-center my-0.5" aria-hidden="true">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{
                            background: "rgba(212,169,78,0.2)",
                            color: "#d4a94e",
                          }}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Unlock button */}
          <div className="shrink-0">
            <Button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group/btn relative inline-flex h-auto w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] px-6 py-2 text-sm font-bold text-white shadow-[0_8px_32px_rgba(162,126,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] sm:w-full sm:px-6 sm:py-2 sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                Unlock Full Analysis
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                  aria-hidden="true"
                />
              </span>
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover/btn:translate-x-full" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,10,7,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl p-px max-h-[90vh]"
            style={{
              background: "linear-gradient(135deg, rgba(212,169,78,0.6), rgba(162,126,45,0.2), rgba(26,107,79,0.3))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto" style={{ background: "#003a27" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              <span
                className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                  border: "1px solid rgba(212,169,78,0.35)",
                  color: "#d4a94e",
                }}
              >
                Full report
              </span>

              <h3 className="text-2xl font-bold tracking-tight" style={{ color: "#ffffff" }}>
                Unlock Full Analysis
              </h3>

              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                Get the complete breakdown of your stranded capacity, side-by-side cooling scenarios and a
                prioritized action plan delivered to your inbox.
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <li key={benefit.label} className="flex items-center gap-2.5">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                          border: "1px solid rgba(212,169,78,0.35)",
                          color: "#d4a94e",
                        }}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-medium text-white">
                        {benefit.label}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="unlock-email" className="sr-only">
                    Work email
                  </label>
                  <input
                    id="unlock-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-12 w-full rounded-xl px-4 text-base outline-none transition"
                    style={{
                      background: "rgba(0,30,20,0.55)",
                      border: "1px solid rgba(26,107,79,0.6)",
                      color: "#ffffff",
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  className="group/btn relative inline-flex h-auto w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] px-6 py-2 text-base font-bold text-white shadow-[0_8px_32px_rgba(162,126,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Send my full analysis
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover/btn:translate-x-full" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}