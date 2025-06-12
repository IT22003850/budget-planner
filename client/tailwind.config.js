module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-datepicker/dist/react-datepicker.css',
  ],
  theme: {
    extend: {
      // Add custom button styles
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn': {
          '@apply px-4 py-2 rounded-md transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply bg-primary text-white hover:bg-blue-600 focus:ring-blue-500': {},
        },
      });
    },
  ],
};