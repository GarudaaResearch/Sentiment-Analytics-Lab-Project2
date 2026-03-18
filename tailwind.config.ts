import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F5E4E",
          50: "#F0FAF7",
          100: "#D0F0E8",
          200: "#A0E1D1",
          300: "#70D2BA",
          400: "#40C3A3",
          500: "#1D9E75",
          600: "#0F5E4E",
          700: "#0A4538",
          800: "#063024",
          900: "#031810",
        },
        accent: "#1D9E75",
        background: "#F8FDFB",
        badge: {
          beginner: "#EF9F27",
          intermediate: "#1D9E75",
          advanced: "#E24B4A",
          capstone: "#7C3AED",
        },
        callout: {
          tip: "#0F5E4E",
          warning: "#EF9F27",
          term: "#2563EB",
        },
      },
      fontFamily: {
        heading: ["DM Serif Display", "Georgia", "serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
        code: ["JetBrains Mono", "Consolas", "monospace"],
        ui: ["DM Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        card: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "gauge-fill": "gaugeFill 1.5s ease-out forwards",
        "flow-right": "flowRight 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gaugeFill: {
          "0%": { "stroke-dashoffset": "251" },
          "100%": { "stroke-dashoffset": "var(--gauge-offset)" },
        },
        flowRight: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(10px)", opacity: "0" },
        },
      },
      boxShadow: {
        card: "0 2px 16px rgba(15, 94, 78, 0.08)",
        "card-hover": "0 8px 32px rgba(15, 94, 78, 0.16)",
        editor: "inset 0 0 0 1px rgba(15, 94, 78, 0.2)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0F5E4E 0%, #1D9E75 50%, #40C3A3 100%)",
        "card-gradient": "linear-gradient(135deg, #F8FDFB 0%, #F0FAF7 100%)",
        "teal-gradient": "linear-gradient(135deg, #0F5E4E 0%, #1D9E75 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
