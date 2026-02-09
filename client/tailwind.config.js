export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#111114', 800: '#18181c', 700: '#1e1e22', 600: '#2a2a2e' },
        accent: { orange: '#E85D3A', amber: '#E85D3A' }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      }
    }
  },
  plugins: []
};
