/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E0E7FF',
          500: '#6366F1',
          900: '#312E81'
        },
        secondary: {
          100: '#F1F5F9',
          500: '#64748B',
          900: '#0F172A'
        },
        background: {
          light: '#FFFFFF',
          dark: '#0F172A'
        },
        surface: {
          light: '#F8FAFC',
          dark: '#1E293B'
        },
        text: {
          light: '#0F172A',
          dark: '#F8FAFC',
          muted: '#94A3B8'
        },
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
        modules: {
          planner: '#2563EB',
          habits: '#10B981',
          goals: '#F59E0B',
          journal: '#8B5CF6',
          journey: '#14B8A6',
          analytics: '#4F46E5'
        }
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px'
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px'
      },
      borderWidth: {
        'thin': '1px',
        'thick': '2px'
      }
    },
  },
  plugins: [],
}
