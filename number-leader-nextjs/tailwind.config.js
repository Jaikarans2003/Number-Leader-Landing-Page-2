/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0B2447',
        'primary-light': '#19376D',
        'secondary': '#576CBC',
        'gold': '#FFB000',
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/img/backgrounds/hero-bg.jpg')",
        'startup-pattern': "url('/assets/img/backgrounds/startups-bg.jpg')",
        'enabler-pattern': "url('/assets/img/backgrounds/enablers-bg.jpg')",
        'cta-pattern': "url('/assets/img/backgrounds/cta-bg.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Roboto', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-gold',
    'text-gold',
    'border-gold',
    'text-white',
    'bg-white',
    'text-gray-300',
    'bg-white/5',
    'bg-white/10',
    'backdrop-blur-sm',
  ],
}; 