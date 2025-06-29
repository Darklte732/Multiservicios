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
        "glass-blue": {
          50: "rgba(59, 130, 246, 0.05)",
          100: "rgba(59, 130, 246, 0.1)",
          200: "rgba(59, 130, 246, 0.15)",
          300: "rgba(59, 130, 246, 0.2)",
        },
        "glass-purple": {
          50: "rgba(139, 92, 246, 0.05)",
          100: "rgba(139, 92, 246, 0.1)",
          200: "rgba(139, 92, 246, 0.15)",
          300: "rgba(139, 92, 246, 0.2)",
        },
        "glass-green": {
          50: "rgba(16, 185, 129, 0.05)",
          100: "rgba(16, 185, 129, 0.1)",
          200: "rgba(16, 185, 129, 0.15)",
          300: "rgba(16, 185, 129, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        "geist-sans": ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
        "5xl": "96px",
      },
      backdropSaturate: {
        120: "1.2",
        150: "1.5",
        200: "2",
      },
      animation: {
        "glass-flow": "glassFlow 20s ease-in-out infinite",
        "progress-shine": "progressShine 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out infinite 2s",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        glassFlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        progressShine: {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            transform: "scale(1)"
          },
          "50%": {
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)",
            transform: "scale(1.05)"
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "glass-gradient-dark": "linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
        "grid-white": "url(\"data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(255 255 255 / 0.05)\'%3e%3cpath d=\'m0 .5h32m-32 32v-32m32 0v32m-32-32h32\'/%3e%3c/svg%3e\")",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 25px 50px rgba(0, 0, 0, 0.15)",
        "glass-xl": "0 35px 60px rgba(0, 0, 0, 0.2)",
        "glass-inner": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-blue": "0 8px 32px rgba(59, 130, 246, 0.15)",
        "glass-purple": "0 8px 32px rgba(139, 92, 246, 0.15)",
        "glass-green": "0 8px 32px rgba(16, 185, 129, 0.15)",
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
        ".glass-effect": {
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
        ".glass-hover": {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          },
        },
        ".glass-active": {
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        },
        ".text-shadow-glass": {
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
        ".bg-glass-pattern": {
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `,
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