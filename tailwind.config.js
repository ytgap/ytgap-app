/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#FF0000',
        'brand-charcoal': '#1F2937',
        'brand-light-gray': '#F9FAFB',
        'brand-off-white': '#F1F1F1',
        'brand-light-dark': '#374151',
        'brand-dark': '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};