/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#8b5cf6',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        'dark-card': '#1e293b',
        'dark-card-hover': '#334155',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};