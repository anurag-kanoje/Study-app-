export const themeConfig = {
  colors: {
    primary: {
      DEFAULT: '#6366f1', // Indigo
      hover: '#4f46e5',
      light: '#e0e7ff',
    },
    secondary: {
      DEFAULT: '#14b8a6', // Teal
      hover: '#0d9488',
      light: '#ccfbf1',
    },
    accent: {
      DEFAULT: '#8b5cf6', // Purple
      hover: '#7c3aed',
      light: '#ede9fe',
    },
    background: {
      DEFAULT: '#ffffff',
      dark: '#0f172a',
      glass: 'rgba(255, 255, 255, 0.8)',
    }
  },
  animations: {
    transition: 'all 0.3s ease',
    hover: 'transform 0.2s ease',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }
} 