import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full transition-all duration-500 bg-[#001e14]/90 backdrop-blur-[16px] border-b border-[#1a6b4f]/35 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            width={260}
            height={260}
            src="/logo.png"
            alt="PhysaFlow"
            className="rounded-sm transition-all group-hover:scale-105 h-auto w-[180px] md:w-[220px]"
          />
        </a>

        {/* Botón de Login Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://dev.physaflow.com/login"
            className="group relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 bg-[linear-gradient(135deg,#a27e2d,#d4a94e)] shadow-[0_4px_20px_rgba(162,126,45,0.35)]"
          >
            <span className="relative z-10">Platform Login</span>
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(135deg,#d4a94e,#a27e2d)]" />
          </a>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/80 hover:text-white transition-colors p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Menú desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1a6b4f]/35 bg-[#001e14]/95 px-6 py-4 flex flex-col gap-4">
          <div className="pt-2">
            <a
              href="https://dev.physaflow.com/login"
              className="block text-center group relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold text-white bg-[linear-gradient(135deg,#a27e2d,#d4a94e)]"
            >
              Platform Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}