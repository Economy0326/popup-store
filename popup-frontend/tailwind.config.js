/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F6',
        text: '#333333',
        textMuted: '#8F8F8F',
        primary: '#4E7CA1',
        secondary: '#D1A46C',
        card: '#FFFFFF',
        line: '#E9E5DD',
      },
      boxShadow: { soft: '0 4px 20px rgba(0,0,0,0.06)' },
      borderRadius: { xl2: '1rem' },
    },
  },
  plugins: [],
}
