"use client"

import { ArrowLeft, Check, Link2, FileDown, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { CalculatorResult } from "@/components/capacity-calculator"

interface FloatingNavbarProps {
  result: CalculatorResult | null
  panelOpen: boolean
  onTogglePanel: () => void
  onGoBack: () => void
}

export default function FloatingNavbar({ result, panelOpen, onTogglePanel, onGoBack }: FloatingNavbarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div className="relative overflow-hidden rounded-2xl p-px bg-[linear-gradient(135deg,rgba(212,169,78,0.6),rgba(162,126,45,0.2),rgba(26,107,79,0.3))] shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-4 rounded-2xl bg-[#003a27]/90 p-3 sm:flex-row sm:items-center sm:justify-between">
          
          {/* SECCIÓN IZQUIERDA: Volver, Título y Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoBack}
              aria-label="Volver a la calculadora"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4a94e]/35 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] transition-all duration-300 hover:scale-105 hover:border-[#d4a94e]"
            >
              <ArrowLeft className="h-5 w-5 text-[#d4a94e]" aria-hidden="true" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                Full Analysis 
              </h2>

              <div className="flex items-center gap-1.5 rounded-full border border-[#d4a94e]/30 bg-[#d4a94e]/10 px-2 py-1 text-xs font-medium text-[#d4a94e]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d4a94e] text-[#003a27]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
                </span>
                <span>Unlocked</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN DERECHA: Botón Toggle Calculadora + Acciones */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onTogglePanel}
              aria-pressed={panelOpen}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d4a94e]/40 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] px-4 text-xs font-semibold text-[#d4a94e] transition hover:border-[#d4a94e] hover:bg-[#d4a94e]/20 sm:text-sm"
            >
              <span>{panelOpen ? "Hide Calculator" : "Edit Inputs"}</span>
              {panelOpen ? (
                <ChevronUp className="h-4 w-4 text-[#d4a94e]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#d4a94e]" />
              )}
            </button>

            <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#a27e2d,#d4a94e)] px-4 text-xs font-semibold text-[#00281b] shadow-md transition hover:brightness-110 sm:text-sm">
              <FileDown className="h-4 w-4" aria-hidden="true" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-4 text-xs font-semibold text-white transition hover:border-[#d4a94e]/40 sm:text-sm"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#d4a94e]" aria-hidden="true" />
              ) : (
                <Link2 className="h-4 w-4 text-white/70" aria-hidden="true" />
              )}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>

            <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-4 text-xs font-semibold text-white transition hover:border-[#d4a94e]/40 sm:text-sm">
              <Share2 className="h-4 w-4 text-white/70" aria-hidden="true" />
              <span>Share Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}