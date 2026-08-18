import { Button } from "@/components/ui/button"; // Ajusta la ruta si es diferente en tu proyecto
import { ArrowRight } from "lucide-react";

export function ButtonAnimation() {
  return (
    <Button
      type="submit"
      className="group relative inline-flex h-auto w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] px-8 py-2 text-base font-bold text-white shadow-[0_8px_32px_rgba(162,126,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[linear-gradient(135deg,#a27e2d_0%,#d4a94e_100%)] sm:w-auto"
    >
      <span className="relative z-10 flex items-center gap-2">
        Calculate
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
    </Button>
  );
}