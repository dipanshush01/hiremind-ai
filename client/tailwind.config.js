module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080A0F',
        surface: '#0F1117',
        'surface-alt': '#141820',
        border: '#1C2030',
        accent: '#5B8AF0',
        green: '#20D472',
        amber: '#F0A832',
        red: '#F05050',
        'text-primary': '#E4E8F2',
        'text-secondary': '#7A8699',
        'text-muted': '#404858',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        serif: ['Instrument Serif', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
};
