"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brain, BookOpen, FlaskConical, BarChart3, Trophy, Download, Menu, X, ChevronRight } from "lucide-react";
import { useProgressStore } from "@/store/progressStore";

const navItems = [
  { href: "/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/playground", label: "Playground", icon: FlaskConical },
  { href: "/visualizer", label: "Visualizer", icon: BarChart3 },
  { href: "/quiz", label: "Quiz", icon: Trophy },
  { href: "/resources", label: "Resources", icon: Download },
  { href: "/dashboard", label: "Dashboard", icon: Brain },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const getCompletionPercentage = useProgressStore((s) => s.getCompletionPercentage);
  const pct = getCompletionPercentage();

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary-100 shadow-sm">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-teal-gradient rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading text-lg text-primary-600 leading-tight">Sentiment Analytics</div>
              <div className="font-ui text-xs text-primary-500/70 leading-tight">NLP Practical Lab</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-150 ${
                    active ? "bg-primary-600 text-white" : "hover:bg-primary-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Progress + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="font-ui text-xs text-primary-600 font-medium">{pct}% Complete</div>
              <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <Link href="/curriculum" className="btn-primary py-2 px-4 text-sm">
              Start Learning <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 text-primary-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-100 bg-background/95 backdrop-blur">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-ui font-medium text-sm transition-all ${
                    active ? "bg-primary-600 text-white" : "text-primary-700 hover:bg-primary-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-primary-100 mt-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="font-ui text-xs text-primary-600 font-medium">{pct}% Complete</div>
                <div className="flex-1 h-2 bg-primary-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
