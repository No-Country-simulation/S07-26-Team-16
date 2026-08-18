"use client"

import type { ComponentType, FormEvent, SVGProps } from "react"
import { useState } from "react"
import { Zap, Snowflake, Wind, Droplets, Waves, ChevronRight } from "lucide-react"
import { ButtonAnimation } from "./ui/buttonPrincipal"

export type CoolingType = "air" | "hybrid" | "liquid" | "immersion"

export interface CalculatorResult {
  facilitySize: number
  utilization: number
  coolingType: CoolingType
  pue: number
  // Layer outputs
  effectiveItCapacity: number
  usableItCapacity: number
  deliveredLoad: number
  // Layer losses (MW)
  facilityLossMw: number
  itLossMw: number
  workloadLossMw: number
  // Aggregate
  strandedCapacity: number
  strandedPercent: number
  // Financials
  annualEnergyWastedMwh: number
  annualLossLow: number
  annualLossAvg: number
  annualLossHigh: number
  totalFacilityCostAvg: number
}

export interface CoolingOption {
  value: CoolingType
  label: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  pueLow: number
  pueHigh: number
  puemid: number
  densityLow: number // kW/rack
  densityHigh: number // kW/rack
}

// Real, researched benchmarks (ASHRAE, Vertiv, Uptime Institute)
export const COOLING_OPTIONS: CoolingOption[] = [
  {
    value: "air",
    label: "Air",
    description: "Traditional CRAC / CRAH",
    icon: Wind,
    pueLow: 1.4,
    pueHigh: 1.6,
    puemid: 1.5,
    densityLow: 10,
    densityHigh: 20,
  },
  {
    value: "hybrid",
    label: "Hybrid",
    description: "Air + rear-door liquid",
    icon: Snowflake,
    pueLow: 1.2,
    pueHigh: 1.4,
    puemid: 1.3,
    densityLow: 20,
    densityHigh: 40,
  },
  {
    value: "liquid",
    label: "Liquid",
    description: "Direct-to-chip cooling",
    icon: Droplets,
    pueLow: 1.05,
    pueHigh: 1.2,
    puemid: 1.125,
    densityLow: 40,
    densityHigh: 80,
  },
  {
    value: "immersion",
    label: "Immersion",
    description: "Full-tank immersion cooling",
    icon: Waves,
    pueLow: 1.02,
    pueHigh: 1.1,
    puemid: 1.06,
    densityLow: 100,
    densityHigh: 200,
  },
]

// ---- Model constants (real-world backed) ----
export const REDUNDANCY_MARGIN = 0.15 // N+1 standard margin, applies to all cooling types
export const HOURS_PER_YEAR = 8760
export const ELECTRICITY_PRICE_LOW = 60 // USD/MWh
export const ELECTRICITY_PRICE_AVG = 83 // USD/MWh — SemiAnalysis benchmark for AI datacenters
export const ELECTRICITY_PRICE_HIGH = 110 // USD/MWh

export function calculate(facilitySize: number, utilization: number, coolingType: CoolingType): CalculatorResult {
  const pue = COOLING_OPTIONS.find((c) => c.value === coolingType)!.puemid

  // Facility layer: overhead lost to cooling (PUE)
  const effectiveItCapacity = facilitySize / pue
  const facilityLossMw = facilitySize - effectiveItCapacity

  // IT layer: redundancy margin reserve
  const usableItCapacity = effectiveItCapacity * (1 - REDUNDANCY_MARGIN)
  const itLossMw = effectiveItCapacity - usableItCapacity

  // Workload layer: underutilization (user input)
  const deliveredLoad = usableItCapacity * (utilization / 100)
  const workloadLossMw = usableItCapacity - deliveredLoad

  const strandedCapacity = facilityLossMw + itLossMw + workloadLossMw // == facilitySize - deliveredLoad
  const strandedPercent = facilitySize > 0 ? (strandedCapacity / facilitySize) * 100 : 0

  const annualEnergyWastedMwh = strandedCapacity * HOURS_PER_YEAR
  const annualLossLow = annualEnergyWastedMwh * ELECTRICITY_PRICE_LOW
  const annualLossAvg = annualEnergyWastedMwh * ELECTRICITY_PRICE_AVG
  const annualLossHigh = annualEnergyWastedMwh * ELECTRICITY_PRICE_HIGH

  const totalFacilityCostAvg = facilitySize * HOURS_PER_YEAR * ELECTRICITY_PRICE_AVG

  return {
    facilitySize,
    utilization,
    coolingType,
    pue,
    effectiveItCapacity,
    usableItCapacity,
    deliveredLoad,
    facilityLossMw,
    itLossMw,
    workloadLossMw,
    strandedCapacity,
    strandedPercent,
    annualEnergyWastedMwh,
    annualLossLow,
    annualLossAvg,
    annualLossHigh,
    totalFacilityCostAvg,
  }
}

// Compute the full result for every cooling type at a fixed facility/utilization.
export function compareAllScenarios(facilitySize: number, utilization: number) {
  return (["air", "hybrid", "liquid", "immersion"] as CoolingType[]).map((type) => ({
    type,
    ...calculate(facilitySize, utilization, type),
  }))
}

export function CapacityCalculator({
  onCalculate,
  collapsed,
  onCollapseChange,
}: {
  onCalculate: (result: CalculatorResult) => void
  collapsed: boolean
  onCollapseChange: (collapsed: boolean) => void
}) {
  const [facilitySize, setFacilitySize] = useState(20)
  const [utilization, setUtilization] = useState(65)
  const [coolingType, setCoolingType] = useState<CoolingType>("air")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onCalculate(calculate(facilitySize, utilization, coolingType))
    onCollapseChange(true)
  }

  return (
    <div
      onClick={() => collapsed && onCollapseChange(false)}
      className={`group relative w-full overflow-hidden rounded-2xl p-px transition-all duration-500 ease-in-out bg-[linear-gradient(135deg,rgba(212,169,78,0.6),rgba(162,126,45,0.2),rgba(26,107,79,0.3))] ${
        collapsed
          ? "h-auto lg:h-full lg:w-[100px] cursor-pointer hover:border-[#d4a94e]"
          : "h-auto lg:h-full hover:-translate-y-1"
      }`}
    >
      <div className="relative flex h-full w-full flex-col rounded-2xl p-4 sm:p-6 bg-[#003a27]/90 transition-all duration-500">
        {/* Glow radial en Hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_20%,rgba(212,169,78,0.07)_0%,transparent_60%)]" />

        {/* MODO COLAPSADO */}
        {collapsed ? (
          <div className="flex flex-row items-center justify-between gap-4 py-1 transition-opacity duration-300 lg:h-full lg:flex-col lg:justify-between lg:gap-0 lg:py-2">
            {/* Ícono Principal */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4a94e]/35 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] transition-all duration-300 group-hover:scale-110 lg:h-12 lg:w-12">
              <Zap className="h-5 w-5 text-[#d4a94e] lg:h-6 lg:w-6" aria-hidden="true" />
            </div>

            {/* Texto: horizontal en mobile, vertical en desktop */}
            <div className="flex flex-1 items-center justify-start lg:my-6 lg:justify-center">
              <h2 className="text-left text-sm font-bold uppercase tracking-wider text-white lg:rotate-180 lg:text-center lg:text-base lg:[writing-mode:vertical-lr]">
                Capacity Waste Calculator
              </h2>
            </div>

            {/* Indicador de expansión al hacer hover/tap */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#d4a94e] transition-colors group-hover:bg-[#d4a94e]/20">
              <ChevronRight className="h-4 w-4 rotate-90 lg:rotate-0" />
            </div>
          </div>
        ) : (
          /* MODO EXPANDIDO (FORMULARIO) */
          <div className="relative flex h-full w-full flex-col transition-opacity duration-300">
            {/* Header del Calculator */}
            <div className="mb-5 flex items-center gap-3 shrink-0 sm:mb-6 sm:gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4a94e]/35 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] transition-all duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                <Zap className="h-5 w-5 text-[#d4a94e] sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <div>
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#a27e2d]">
                  Capacity Engine
                </span>
                <h2 className="text-base font-bold leading-tight text-white sm:text-lg">
                  Capacity Waste Calculator
                </h2>
                <p className="text-xs text-white/50 sm:text-sm">
                  Model your facility in three inputs
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between gap-4 min-h-0">
              {/* Input: Facility size */}
              <div className="flex flex-col gap-2">
                <label htmlFor="facility-size" className="text-sm font-medium text-white/80">
                  Facility Size
                </label>
                <div className="relative">
                  <input
                    id="facility-size"
                    type="number"
                    min={0}
                    step={0.5}
                    value={facilitySize}
                    onChange={(e) => setFacilitySize(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#d4a94e]/30 bg-[#00281b] px-4 py-3 pr-16 text-base font-medium text-white outline-none transition focus:border-[#d4a94e] focus:ring-2 focus:ring-[#d4a94e]/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-white/40">
                    MW
                  </span>
                </div>
              </div>

              {/* Slider: Utilization */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="utilization" className="text-sm font-medium text-white/80">
                    Utilization
                  </label>
                  <span className="text-sm font-semibold text-[#d4a94e]">{utilization}%</span>
                </div>
                <input
                  id="utilization"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={utilization}
                  onChange={(e) => setUtilization(Number(e.target.value))}
                  className="capacity-slider accent-[#d4a94e]"
                  style={{
                    background: `linear-gradient(to right, #d4a94e 0%, #d4a94e ${utilization}%, rgba(255,255,255,0.1) ${utilization}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Fieldset: Cooling type */}
              <fieldset className="flex flex-col gap-2 lg:flex-1 lg:min-h-0">
                <legend className="mb-1 text-sm font-medium text-white/80">Cooling Type</legend>
                <div className="flex flex-col gap-2 lg:flex-1 lg:justify-between lg:overflow-y-auto">
                  {COOLING_OPTIONS.map((option) => {
                    const Icon = option.icon
                    const active = coolingType === option.value
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all lg:flex-1 ${
                          active
                            ? "border-[#d4a94e] bg-[rgba(212,169,78,0.1)] ring-1 ring-[#d4a94e]/30"
                            : "border-white/10 bg-[#00281b] hover:border-[#d4a94e]/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cooling"
                          value={option.value}
                          checked={active}
                          onChange={() => setCoolingType(option.value)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active
                              ? "bg-[#d4a94e] text-[#003a27]"
                              : "bg-white/5 text-white/50"
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium text-white">{option.label}</span>
                          <span className="text-xs text-white/50">{option.description}</span>
                        </span>
                        <span
                          className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            active ? "border-[#d4a94e]" : "border-white/20"
                          }`}
                          aria-hidden="true"
                        >
                          {active && <span className="h-2.5 w-2.5 rounded-full bg-[#d4a94e]" />}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <ButtonAnimation />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}