import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#0A0F1E",
          900: "#0D1224",
          800: "#111827",
          700: "#1A2035",
          600: "#1E2845",
        },
        electric: {
          DEFAULT: "#EAB308",
          bright: "#F5C518",
          hover: "#CA9A07",
          50: "rgba(234, 179, 8, 0.05)",
          100: "rgba(234, 179, 8, 0.1)",
          200: "rgba(234, 179, 8, 0.2)",
          300: "rgba(234, 179, 8, 0.3)",
          400: "rgba(234, 179, 8, 0.4)",
          500: "rgba(234, 179, 8, 0.5)",
        },
        emergency: {
          DEFAULT: "#EF4444",
          dark: "#450A0A",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        "geist-sans": ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "hero": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      animation: {
        "electric-pulse": "electricPulse 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-right": "slideRight 0.5s ease-in-out",
        "badge-bounce": "badgeBounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "progress-shine": "progressShine 2s ease-in-out infinite",
        "emergency-pulse": "emergencyPulse 2s ease-in-out infinite",
      },
      keyframes: {
        electricPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(234, 179, 8, 0.7)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        badgeBounce: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -8px, 0)" },
          "70%": { transform: "translate3d(0, -4px, 0)" },
          "90%": { transform: "translate3d(0,-2px,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        progressShine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        emergencyPulse: {
          "0%, 100%": { backgroundColor: "rgba(239, 68, 68, 0.9)" },
          "50%": { backgroundColor: "rgba(239, 68, 68, 1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dot-grid": "radial-gradient(circle, rgba(234,179,8,0.15) 1px, transparent 1px)",
        "electric-gradient": "linear-gradient(135deg, #EAB308, #F5C518)",
        "navy-gradient": "linear-gradient(135deg, #0A0F1E, #111827)",
      },
      backgroundSize: {
        "dot-grid": "32px 32px",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(234, 179, 8, 0.3)",
        "glow-md": "0 0 30px rgba(234, 179, 8, 0.4)",
        "glow-lg": "0 0 60px rgba(234, 179, 8, 0.5)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234, 179, 8, 0.15)",
        "emergency": "0 4px 24px rgba(239, 68, 68, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
        "5xl": "96px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
      },
      blur: {
        "4xl": "72px",
        "5xl": "96px",
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        // Navigation
        ".dark-nav": {
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: "rgba(10, 15, 30, 0.9)",
          borderBottom: "1px solid rgba(234, 179, 8, 0.1)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        },
        // Cards
        ".dark-card": {
          background: "#1A2035",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        ".dark-card:hover": {
          border: "1px solid rgba(234, 179, 8, 0.3)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234, 179, 8, 0.15)",
          transform: "translateY(-2px)",
        },
        // Service card on dark
        ".service-card-dark": {
          background: "#1A2035",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "20px",
          padding: "1.5rem",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          minHeight: "280px",
          touchAction: "manipulation",
        },
        ".service-card-dark:hover": {
          border: "1px solid rgba(234, 179, 8, 0.4)",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234, 179, 8, 0.2)",
          transform: "translateY(-4px)",
        },
        // Buttons
        ".btn-electric": {
          background: "linear-gradient(135deg, #EAB308, #F5C518)",
          color: "#0A0F1E",
          fontWeight: "700",
          border: "none",
          borderRadius: "12px",
          padding: "0.875rem 1.75rem",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 4px 20px rgba(234, 179, 8, 0.3)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          textDecoration: "none",
        },
        ".btn-electric:hover": {
          background: "linear-gradient(135deg, #CA9A07, #EAB308)",
          boxShadow: "0 6px 30px rgba(234, 179, 8, 0.5)",
          transform: "translateY(-2px)",
        },
        ".btn-emergency": {
          background: "linear-gradient(135deg, #EF4444, #DC2626)",
          color: "#ffffff",
          fontWeight: "700",
          border: "none",
          borderRadius: "12px",
          padding: "0.875rem 1.75rem",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          textDecoration: "none",
        },
        ".btn-emergency:hover": {
          background: "linear-gradient(135deg, #DC2626, #B91C1C)",
          boxShadow: "0 6px 30px rgba(239, 68, 68, 0.5)",
          transform: "translateY(-2px)",
        },
        ".btn-outline-electric": {
          background: "transparent",
          color: "#EAB308",
          fontWeight: "600",
          border: "2px solid #EAB308",
          borderRadius: "12px",
          padding: "0.75rem 1.5rem",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          textDecoration: "none",
        },
        ".btn-outline-electric:hover": {
          background: "rgba(234, 179, 8, 0.1)",
          boxShadow: "0 0 20px rgba(234, 179, 8, 0.2)",
        },
        // Badges
        ".electric-badge": {
          background: "#EAB308",
          color: "#0A0F1E",
          fontWeight: "700",
          fontSize: "0.75rem",
          letterSpacing: "0.05em",
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
        },
        ".electric-badge-outline": {
          background: "transparent",
          color: "#EAB308",
          fontWeight: "600",
          fontSize: "0.75rem",
          border: "1px solid #EAB308",
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
        },
        // Testimonial card
        ".testimonial-card": {
          background: "#1A2035",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "16px",
          padding: "1.5rem",
          transition: "all 0.3s ease",
        },
        ".testimonial-card:hover": {
          border: "1px solid rgba(234, 179, 8, 0.2)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        },
        // Emergency banner
        ".emergency-banner": {
          background: "linear-gradient(90deg, #7F1D1D, #EF4444, #7F1D1D)",
          backgroundSize: "200% 100%",
          animation: "emergencyPulse 2s ease-in-out infinite",
          color: "white",
          fontWeight: "700",
          textAlign: "center",
          padding: "0.75rem 1rem",
          fontSize: "0.875rem",
          position: "relative",
        },
        // WhatsApp float
        ".whatsapp-float": {
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: "60",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          color: "white",
          borderRadius: "9999px",
          padding: "0.875rem",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
        },
        ".whatsapp-float:hover": {
          transform: "translateY(-4px) scale(1.05)",
          boxShadow: "0 8px 30px rgba(37, 211, 102, 0.6)",
        },
        // Gradient text
        ".gradient-text-electric": {
          background: "linear-gradient(135deg, #EAB308, #F5C518, #EAB308)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
        // Divider
        ".electric-divider": {
          height: "2px",
          background: "linear-gradient(90deg, transparent, #EAB308, transparent)",
          border: "none",
          margin: "2rem 0",
        },
        // Section backgrounds
        ".section-primary": {
          background: "#0A0F1E",
        },
        ".section-secondary": {
          background: "#111827",
        },
        ".section-tertiary": {
          background: "#1A2035",
        },
        // Stats
        ".stat-number": {
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "#EAB308",
          letterSpacing: "-0.02em",
          lineHeight: "1",
        },
        // Process step number
        ".process-step-number": {
          width: "3rem",
          height: "3rem",
          background: "linear-gradient(135deg, #EAB308, #F5C518)",
          color: "#0A0F1E",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "900",
          fontSize: "1.25rem",
          boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)",
          flexShrink: "0",
        },
        // Input dark
        ".input-dark": {
          background: "#1A2035",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          color: "white",
          padding: "0.75rem 1rem",
          transition: "all 0.2s ease",
          outline: "none",
          width: "100%",
        },
        ".input-dark:focus": {
          border: "1px solid rgba(234, 179, 8, 0.5)",
          boxShadow: "0 0 0 3px rgba(234, 179, 8, 0.1)",
        },
        ".input-dark::placeholder": {
          color: "rgba(255,255,255,0.3)",
        },
        // Coming soon overlay
        ".coming-soon-overlay-dark": {
          position: "absolute",
          inset: "0",
          background: "rgba(10, 15, 30, 0.75)",
          backdropFilter: "blur(4px)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        },
      }
      addUtilities(newUtilities)
    },
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
