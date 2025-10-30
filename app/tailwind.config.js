/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // iOS 风格颜色
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
        },
        // 浅色模式
        light: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          border: '#E5E5EA',
          text: {
            primary: '#000000',
            secondary: '#3C3C43',
            tertiary: '#8E8E93',
          },
        },
        // 深色模式
        dark: {
          bg: '#000000',
          card: '#1C1C1E',
          border: '#38383A',
          text: {
            primary: '#FFFFFF',
            secondary: '#EBEBF5',
            tertiary: '#8E8E93',
          },
        },
      },
      borderRadius: {
        ios: '10px',
        'ios-lg': '12px',
      },
      boxShadow: {
        ios: '0 2px 10px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
