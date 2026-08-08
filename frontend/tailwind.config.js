/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aurum: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#E8DFD0',
          400: '#D4AF37', // Signature Champagne Gold
          500: '#C59F2D',
          600: '#997B22',
          700: '#6D5718',
          800: '#42350E',
          900: '#1F1805',
        },
        charcoal: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#6C757D',
          500: '#495057',
          600: '#343A40',
          700: '#212529',
          800: '#1A1A1A', // Deep Luxury Charcoal
          900: '#0F0F0F',
        },
        emerald: {
          DEFAULT: '#1E4D2B',
          light: '#E8F5E9',
          dark: '#14381E'
        },
        rosegold: {
          DEFAULT: '#B76E79',
          light: '#F8EFF0',
          dark: '#934F59'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(26, 26, 26, 0.05), 0 2px 6px -1px rgba(26, 26, 26, 0.03)',
        'luxury-hover': '0 10px 30px -4px rgba(212, 175, 55, 0.12), 0 4px 12px -2px rgba(26, 26, 26, 0.06)',
        'luxury-card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
