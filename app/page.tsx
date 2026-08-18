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
    <main className="relative h-screen w-screen bg-background overflow-hidden">
      {/* VIDEO DE FONDO */}
      <div className="absolute inset-0 z-0 flex items-center justify-center p-16 pointer-events-none">
        <div 
          className="w-full max-w-7xl aspect-video overflow-hidden shadow-2xl shadow-emerald-950/30"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 0%, black 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, black 40%, transparent 75%)",
          }}
        >
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
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
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden bg-[linear-gradient(rgba(26,107,79,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(26,107,79,0.18)_1px,transparent_1px)] bg-[size:64px_64px]">
          {showDashboard ? (
            /* MODO DASHBOARD */
            <div className="mx-auto flex h-full max-w-7xl min-h-0 flex-col px-10 pt-24 pb-6">
              {editPanelOpen ? (
                /* Dos columnas: calculadora (izq, siempre expandida) + dashboard en 1 columna (der) */
                <div className="grid flex-1 min-h-0 grid-cols-1 gap-8 overflow-y-auto lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] lg:overflow-visible">
                  <div className="min-h-0 lg:min-w-0">
                    <CapacityCalculator
                      onCalculate={handleEditCalculate}
                      collapsed={false}
                      onCollapseChange={() => {}}
                    />
                  </div>
                  <div className="min-h-0 lg:overflow-y-auto lg:min-w-0">
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
            <div className="mx-auto flex h-full max-w-7xl flex-col px-10 py-6">
              <div className={`grid flex-1 min-h-0 grid-cols-1 gap-8 ${gridColumnsClass}`}>
                <div className="min-h-0 lg:min-w-0 flex items-center justify-center">
                  <CapacityCalculator
                    onCalculate={handleCalculate}
                    collapsed={calculatorCollapsed}
                    onCollapseChange={setCalculatorCollapsed}
                  />
                </div>
                <div className="min-h-0 lg:min-w-0">
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