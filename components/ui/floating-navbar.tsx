"use client"

import { ArrowLeft, Check, Link2, FileDown, Share2, ChevronDown, ChevronUp, MoreVertical, X } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 transition-all duration-300">
      <div className="relative overflow-hidden rounded-2xl p-px bg-[linear-gradient(135deg,rgba(212,169,78,0.6),rgba(162,126,45,0.2),rgba(26,107,79,0.3))] shadow-2xl backdrop-blur-md">
        <div className="flex flex-col rounded-2xl bg-[#003a27]/90 p-3 transition-all duration-300 ease-in-out">
          
          {/* FILA SUPERIOR / PRINCIPAL */}
          <div className="flex items-center justify-between gap-2">
            
            {/* SECCIÓN IZQUIERDA: Volver, Título y Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onGoBack}
                aria-label="Volver a la calculadora"
                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4a94e]/35 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] transition-all duration-300 hover:scale-105 hover:border-[#d4a94e]"
              >
                <ArrowLeft className="h-5 w-5 text-[#d4a94e]" aria-hidden="true" />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white sm:text-base">
                  Full Analysis 
                </h2>

                <div className="flex items-center gap-1.5 rounded-full border border-[#d4a94e]/30 bg-[#d4a94e]/10 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-[#d4a94e]">
                  <span className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#d4a94e] text-[#003a27]">
                    <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
                  </span>
                  <span>Unlocked</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DERECHA - DESKTOP (sm en adelante) */}
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <button
                onClick={onTogglePanel}
                aria-pressed={panelOpen}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d4a94e]/40 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] px-4 text-sm font-semibold text-[#d4a94e] transition hover:border-[#d4a94e] hover:bg-[#d4a94e]/20"
              >
                <span>{panelOpen ? "Hide Calculator" : "Edit Inputs"}</span>
                {panelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#a27e2d,#d4a94e)] px-4 text-sm font-semibold text-[#00281b] shadow-md transition hover:brightness-110">
                <FileDown className="h-4 w-4" aria-hidden="true" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-4 text-sm font-semibold text-white transition hover:border-[#d4a94e]/40"
              >
                {copied ? <Check className="h-4 w-4 text-[#d4a94e]" /> : <Link2 className="h-4 w-4 text-white/70" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>

              <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-4 text-sm font-semibold text-white transition hover:border-[#d4a94e]/40">
                <Share2 className="h-4 w-4 text-white/70" aria-hidden="true" />
                <span>Share Report</span>
              </button>
            </div>

            {/* CONTROLES MÓVIL (Botonera para abrir/cerrar expansión) */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                onClick={onTogglePanel}
                aria-pressed={panelOpen}
                className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#d4a94e]/40 bg-[linear-gradient(135deg,rgba(212,169,78,0.2),rgba(162,126,45,0.1))] px-2.5 text-xs font-semibold text-[#d4a94e]"
              >
                <span>{panelOpen ? "Hide" : "Edit"}</span>
                {panelOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Expandir opciones"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#00281b] text-white transition-all active:scale-95"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4 text-[#d4a94e]" />
                ) : (
                  <MoreVertical className="h-4 w-4 text-[#d4a94e]" />
                )}
              </button>
            </div>

          </div>

          {/* SECCIÓN DESPLEGABLE DENTRO DEL NAVBAR (MÓVIL) */}
          <div
            className={`grid transition-all duration-300 ease-in-out sm:hidden ${
              mobileMenuOpen ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-[#d4a94e]/20" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#a27e2d,#d4a94e)] px-4 text-xs font-semibold text-[#00281b] shadow-md"
                >
                  <FileDown className="h-4 w-4" aria-hidden="true" />
                  <span>Download PDF</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-3 text-xs font-semibold text-white active:border-[#d4a94e]/40"
                  >
                    {copied ? <Check className="h-4 w-4 text-[#d4a94e]" /> : <Link2 className="h-4 w-4 text-white/70" />}
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#00281b] px-3 text-xs font-semibold text-white active:border-[#d4a94e]/40"
                  >
                    <Share2 className="h-4 w-4 text-white/70" aria-hidden="true" />
                    <span>Share Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}