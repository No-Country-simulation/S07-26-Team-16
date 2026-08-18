"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, BarChart3, Layers, FileDown, Lightbulb, X, ArrowRight } from "lucide-react"

const BENEFITS = [
  { label: "Compare cooling scenarios", icon: BarChart3 },
  { label: "Layer-by-layer breakdown", icon: Layers },
  { label: "Download PDF report", icon: FileDown },
  { label: "Tailored recommendations", icon: Lightbulb },
]

export function UnlockAnalysis({ onUnlock }: { onUnlock?: (email: string) => void }) {
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

  return (
    <section
      className="group relative overflow-hidden rounded-2xl p-px"
      style={{
        background: "linear-gradient(135deg, rgba(212,169,78,0.6), rgba(162,126,45,0.2), rgba(26,107,79,0.3))",
      }}
    >
      <div className="relative overflow-hidden rounded-2xl p-8 lg:p-10" style={{ background: "#003a27" }}>
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at 20% 20%, rgba(212,169,78,0.07) 0%, transparent 60%)" }}
        />

        <div className="relative flex flex-col gap-8">
          {submitted ? (
            <>
              <div>
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
                <h2 className="text-2xl font-bold tracking-tight text-balance" style={{ color: "#ffffff" }}>
                  Unlock Full Analysis
                </h2>
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-5 py-4"
                style={{ border: "1px solid rgba(212,169,78,0.35)", background: "rgba(212,169,78,0.08)" }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #a27e2d, #d4a94e)", color: "#003a27" }}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
                  Your full analysis is on its way to{" "}
                  <span style={{ color: "#d4a94e" }}>{email}</span>.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Header + Benefits side by side */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                {/* Left: copy */}
                <div>
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
                  <h2 className="text-2xl font-bold tracking-tight text-balance" style={{ color: "#ffffff" }}>
                    Unlock Full Analysis
                  </h2>
                  <p
                    className="mt-2 max-w-md text-sm leading-relaxed text-pretty"
                    style={{ color: "rgba(255,255,255,0.48)" }}
                  >
                    Get the complete breakdown of your stranded capacity, side-by-side cooling scenarios and a
                    prioritized action plan delivered to your inbox.
                  </p>
                </div>

                {/* Right: benefits */}
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {BENEFITS.map((benefit) => {
                    const Icon = benefit.icon
                    return (
                      <li key={benefit.label} className="flex items-start gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                          style={{
                            background: "linear-gradient(135deg, rgba(212,169,78,0.2), rgba(162,126,45,0.1))",
                            border: "1px solid rgba(212,169,78,0.35)",
                            color: "#d4a94e",
                          }}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="pt-1.5 text-sm font-medium" style={{ color: "#ffffff" }}>
                          {benefit.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Unlock button */}
              <Button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group/btn relative inline-flex h-auto w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(162,126,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] sm:w-auto"
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
            </>
          )}
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl p-px"
            style={{
              background: "linear-gradient(135deg, rgba(212,169,78,0.6), rgba(162,126,45,0.2), rgba(26,107,79,0.3))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl p-8" style={{ background: "#003a27" }}>
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
              <h3 className="text-xl font-bold" style={{ color: "#ffffff" }}>
                Get your full analysis
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
                Enter your work email and we&apos;ll send the complete stranded capacity report straight to your
                inbox.
              </p>

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
                  className="group/btn relative inline-flex h-auto w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(162,126,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)]"
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