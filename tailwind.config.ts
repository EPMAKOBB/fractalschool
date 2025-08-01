// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",         // shadcn переключает темы именно так
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      /* --- базовые CSS-переменные, которые шадси-компоненты
         подставляют в классы bg-background, text-primary и т.д. --- */
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",

        primary:           { DEFAULT: "hsl(var(--primary))",
                             foreground: "hsl(var(--primary-foreground))" },
        secondary:         { DEFAULT: "hsl(var(--secondary))",
                             foreground: "hsl(var(--secondary-foreground))" },
        muted:             { DEFAULT: "hsl(var(--muted))",
                             foreground: "hsl(var(--muted-foreground))" },
        destructive:       { DEFAULT: "hsl(var(--destructive))",
                             foreground: "hsl(var(--destructive-foreground))" },
        accent:            { DEFAULT: "hsl(var(--accent))",
                             foreground: "hsl(var(--accent-foreground))" },
        popover:           { DEFAULT: "hsl(var(--popover))",
                             foreground: "hsl(var(--popover-foreground))" },
        card:              { DEFAULT: "hsl(var(--card))",
                             foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
export default config;
