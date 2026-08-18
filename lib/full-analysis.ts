// Single source of truth for the Full Analysis prototype calculation model.
// All Full Analysis components derive their displayed values from these functions.

export type CoolingType = "air" | "hybrid" | "liquid"

export interface CalculatorState {
  facilityMW: number
  utilization: number
  coolingType: CoolingType
  comparisonCoolingType: CoolingType
}

// Deterministic prototype cooling factors
export const COOLING_FACTORS: Record<CoolingType, number> = {
  air: 0.6,
  hybrid: 0.48,
  liquid: 0.35,
}

export const COOLING_LABELS: Record<CoolingType, string> = {
  air: "Air",
  hybrid: "Hybrid",
  liquid: "Liquid",
}

export const COOLING_ORDER: CoolingType[] = ["air", "hybrid", "liquid"]

// Financial reference: annual cost per stranded MW (USD)
export const COST_PER_MW = {
  min: 200_000,
  average: 250_000,
  max: 300_000,
}

// Radar reference scores per cooling technology (0-100, higher is better)
const COOLING_EFFICIENCY_SCORE: Record<CoolingType, number> = {
  air: 40,
  hybrid: 62,
  liquid: 85,
}
const COST_EFFICIENCY_SCORE: Record<CoolingType, number> = {
  air: 55,
  hybrid: 72,
  liquid: 90,
}

// ---- Reusable calculation functions ----

export function calculateStrandedPercent(utilization: number, coolingType: CoolingType): number {
  return (100 - utilization) * COOLING_FACTORS[coolingType]
}

export function calculateStrandedMW(facilityMW: number, utilization: number, coolingType: CoolingType): number {
  return facilityMW * (calculateStrandedPercent(utilization, coolingType) / 100)
}

export function calculateAnnualLoss(strandedMW: number) {
  return {
    min: strandedMW * COST_PER_MW.min,
    average: strandedMW * COST_PER_MW.average,
    max: strandedMW * COST_PER_MW.max,
  }
}

export function calculateLayerBreakdown(strandedMW: number) {
  // Portion of the total stranded capacity attributed to each transition
  return {
    facility: strandedMW * 0.45,
    it: strandedMW * 0.35,
    workload: strandedMW * 0.2,
  }
}

export interface FlowLayer {
  key: "facility" | "it" | "workload"
  label: string
  sub: string
  incoming: number
  lostHere: number
  passes: number
}

export function calculateCapacityFlow(
  facilityMW: number,
  utilization: number,
  coolingType: CoolingType,
): FlowLayer[] {
  const strandedMW = calculateStrandedMW(facilityMW, utilization, coolingType)
  const breakdown = calculateLayerBreakdown(strandedMW)

  const facilityIncoming = facilityMW
  const itIncoming = facilityIncoming - breakdown.facility
  const workloadIncoming = itIncoming - breakdown.it

  return [
    {
      key: "facility",
      label: "Facility",
      sub: "Nameplate power",
      incoming: facilityIncoming,
      lostHere: breakdown.facility,
      passes: facilityIncoming - breakdown.facility,
    },
    {
      key: "it",
      label: "IT",
      sub: "Usable after cooling",
      incoming: itIncoming,
      lostHere: breakdown.it,
      passes: itIncoming - breakdown.it,
    },
    {
      key: "workload",
      label: "Workload",
      sub: "Actually delivered",
      incoming: workloadIncoming,
      lostHere: breakdown.workload,
      passes: workloadIncoming - breakdown.workload,
    },
  ]
}

export interface ScenarioResult {
  type: CoolingType
  label: string
  strandedPercent: number
  strandedMW: number
  annualLoss: ReturnType<typeof calculateAnnualLoss>
}

export function calculateScenario(
  facilityMW: number,
  utilization: number,
  coolingType: CoolingType,
): ScenarioResult {
  const strandedPercent = calculateStrandedPercent(utilization, coolingType)
  const strandedMW = calculateStrandedMW(facilityMW, utilization, coolingType)
  return {
    type: coolingType,
    label: COOLING_LABELS[coolingType],
    strandedPercent,
    strandedMW,
    annualLoss: calculateAnnualLoss(strandedMW),
  }
}

export function calculateCoolingComparison(
  facilityMW: number,
  utilization: number,
  current: CoolingType,
  comparison: CoolingType,
) {
  const currentScenario = calculateScenario(facilityMW, utilization, current)
  const comparisonScenario = calculateScenario(facilityMW, utilization, comparison)
  const projectedSavings = currentScenario.annualLoss.average - comparisonScenario.annualLoss.average
  const recoveredMW = currentScenario.strandedMW - comparisonScenario.strandedMW
  return { current: currentScenario, comparison: comparisonScenario, projectedSavings, recoveredMW }
}

export interface RadarAxis {
  axis: string
  value: number
}

// Exactly 4 axes. Reacts to cooling technology and current input values.
export function calculateRadarData(utilization: number, coolingType: CoolingType): RadarAxis[] {
  return [
    { axis: "Cooling", value: COOLING_EFFICIENCY_SCORE[coolingType] },
    { axis: "Recovery", value: Math.max(0, 100 - calculateStrandedPercent(utilization, coolingType)) },
    { axis: "Utilization", value: utilization },
    { axis: "Cost", value: COST_EFFICIENCY_SCORE[coolingType] },
  ]
}

// ---- Industry reference content (single definition, reused across A2, A3, A5) ----

export const INDUSTRY_CONTEXT = {
  utilizationBenchmark: [
    { label: "Avg. facility utilization", value: "~55%" },
    { label: "Typical stranded capacity", value: "20–30%" },
    { label: "Best-in-class PUE", value: "1.1" },
  ],
  electricityPrices: [
    { region: "US Industrial", price: "$0.083 / kWh" },
    { region: "EU Industrial", price: "$0.158 / kWh" },
    { region: "APAC Industrial", price: "$0.112 / kWh" },
  ],
  strandedCostPerMW: [
    { label: "Minimum", value: "$200k / MW-yr" },
    { label: "Average", value: "$250k / MW-yr" },
    { label: "Maximum", value: "$300k / MW-yr" },
  ],
}

// ---- Formatting helpers ----

export function formatUsd(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`
  return `${sign}$${Math.round(abs)}`
}

export function formatMW(value: number): string {
  return `${value.toFixed(1)} MW`
}
