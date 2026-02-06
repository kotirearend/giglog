export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#0a0a0f', 800: '#12121f', 700: '#1a1a2e', 600: '#2d2d44' },
        accent: { purple: '#8B5CF6', pink: '#EC4899', amber: '#F59E0B' }
      }
    }
  },
  plugins: []
};
