import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",

        /* DEON editorial palette */
        noir: "hsl(var(--noir))",
        bone: "hsl(var(--bone))",
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
          deep: "hsl(var(--gold-deep))"
        },
        sand: "hsl(var(--sand))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "Georgia", "serif"]
      },
      fontSize: {
        "display-sm": ["clamp(2.25rem, 6vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.75rem, 8vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(3.25rem, 11vw, 8.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.28em" }]
      },
      letterSpacing: {
        widest: "0.28em",
        ultra: "0.42em"
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
        xl: "18px",
        full: "9999px"
      },
      boxShadow: {
        hairline: "inset 0 0 0 1px hsl(var(--border))",
        lift: "0 24px 60px -24px hsl(240 20% 2% / 0.85)",
        glow: "0 0 0 1px hsl(var(--gold) / 0.35), 0 24px 70px -28px hsl(var(--gold) / 0.4)",
        inset: "inset 0 1px 0 0 hsl(0 0% 100% / 0.06)"
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(100deg, hsl(var(--gold-deep)) 0%, hsl(var(--gold)) 42%, hsl(var(--gold-soft)) 62%, hsl(var(--gold-deep)) 100%)",
        "grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.32'/%3E%3C/svg%3E\")"
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "marquee": {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" }
        },
        "sheen": {
          from: { backgroundPosition: "200% center" },
          to: { backgroundPosition: "-200% center" }
        },
        "drawer-in": {
          from: { opacity: "0", transform: "translate3d(0, -2%, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" }
        },
        "modal-in": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0) scale(0.985)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0) scale(1)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.7s ease both",
        marquee: "marquee 38s linear infinite",
        sheen: "sheen 6s linear infinite",
        "drawer-in": "drawer-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) both",
        "modal-in": "modal-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;