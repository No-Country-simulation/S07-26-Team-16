"use client"

import { useState } from "react"
import { CapacityCalculator, type CalculatorResult } from "@/components/capacity-calculator"
import { ResultPanel } from "@/components/result-panel"
import { FullDashboard } from "@/components/full-dashboard"
import FloatingNavbar from "@/components/ui/floating-navbar"

export default function Page() {
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [calculatorCollapsed, setCalculatorCollapsed] = useState(false)

  // Panel de edición de inputs dentro del dashboard (controlado por FloatingNavbar)
  const [editPanelOpen, setEditPanelOpen] = useState(false)

  function handleGoBack() {
    setResult(null)
    setUnlocked(false)
    setEditPanelOpen(false)
  }

  function handleCalculate(r: CalculatorResult) {
    setResult(r)
    setUnlocked(false)
  }

  // Cuando recalculás desde el panel de edición dentro del dashboard:
  // actualiza el resultado y cierra el panel para volver al dashboard completo.
  function handleEditCalculate(r: CalculatorResult) {
    setResult(r)
    setEditPanelOpen(false)
  }

  const gridColumnsClass = calculatorCollapsed
    ? "lg:grid-cols-[minmax(120px,120px)_minmax(0,1fr)]"
    : "lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]"

  const showDashboard = result && unlocked

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-background lg:h-screen lg:overflow-hidden">
      {/* VIDEO DE FONDO */}
      {/* fixed en vez de absolute: en mobile el contenido puede scrollear, el video queda fijo como backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center p-0 sm:p-8 lg:p-16">
        <div
          className="h-full w-full overflow-hidden shadow-2xl shadow-emerald-950/30 [mask-image:radial-gradient(ellipse_at_center,black_0%,black_65%,transparent_95%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,black_65%,transparent_95%)] lg:h-auto lg:max-w-7xl lg:[aspect-ratio:16/9] lg:[mask-image:radial-gradient(ellipse_at_center,black_0%,black_40%,transparent_75%)] lg:[-webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,black_40%,transparent_75%)]"
        >
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source src="/fondo.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>
      </div>

      {/* NAVBAR FLOTANTE */}
      {showDashboard && (
        <FloatingNavbar
          result={result}
          panelOpen={editPanelOpen}
          onTogglePanel={() => setEditPanelOpen((v) => !v)}
          onGoBack={handleGoBack}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:h-full lg:overflow-hidden">
        <div className="flex-1 bg-[linear-gradient(rgba(26,107,79,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(26,107,79,0.18)_1px,transparent_1px)] bg-[size:64px_64px] lg:min-h-0 lg:overflow-hidden">
          {showDashboard ? (
            /* MODO DASHBOARD */
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-6 pt-24 lg:pt-20 sm:px-6 lg:h-full lg:min-h-0 lg:px-10 lg:pt-24">
              {editPanelOpen ? (
                /* Dos columnas: calculadora (izq, siempre expandida) + dashboard en 1 columna (der) */
                <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] lg:gap-8 lg:overflow-visible">
                  <div className="min-h-0 lg:min-w-0">
                    <CapacityCalculator
                      onCalculate={handleEditCalculate}
                      collapsed={false}
                      onCollapseChange={() => {}}
                    />
                  </div>
                  <div className="min-h-0 lg:min-w-0 lg:overflow-y-auto">
                    <FullDashboard result={result} singleColumn />
                  </div>
                </div>
              ) : (
                /* Full width: solo dashboard, secciones en su grid normal */
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <FullDashboard result={result} />
                </div>
              )}
            </div>
          ) : (
            /* MODO CALCULADORA INICIAL */
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:h-full lg:px-10">
              <div className={`grid flex-1 grid-cols-1 gap-6 lg:min-h-0 lg:gap-8 ${gridColumnsClass}`}>
                {/* Calculadora: en mobile va SEGUNDA (order-2), en desktop vuelve a ir primera (lg:order-1) */}
                <div className="order-2 flex items-center justify-center lg:order-1 lg:min-h-0 lg:min-w-0">
                  <CapacityCalculator
                    onCalculate={handleCalculate}
                    collapsed={calculatorCollapsed}
                    onCollapseChange={setCalculatorCollapsed}
                  />
                </div>
                {/* Resultado: en mobile va PRIMERO (order-1), en desktop vuelve a ir segundo (lg:order-2) */}
                <div className="order-1 lg:order-2 lg:min-h-0 lg:min-w-0">
                  <ResultPanel result={result} onUnlock={() => setUnlocked(true)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}