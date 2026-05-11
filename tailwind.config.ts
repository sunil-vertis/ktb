import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius-default, 8px)',
        sm: 'var(--radius-sm, 4px)',
        md: 'var(--radius-md, 12px)',
        lg: 'var(--radius-lg, 16px)',
        xl: 'var(--radius-xl, 24px)',
        full: 'var(--radius-full, 9999px)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm, 0 1px 3px rgba(0, 37, 51, 0.08))',
        DEFAULT: 'var(--shadow-default, 0 4px 12px rgba(0, 37, 51, 0.1))',
        md: 'var(--shadow-md, 0 8px 24px rgba(0, 37, 51, 0.12))',
        lg: 'var(--shadow-lg, 0 16px 48px rgba(0, 37, 51, 0.16))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
