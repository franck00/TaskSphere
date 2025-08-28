import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6347', // Example primary color (Tomato)
        secondary: '#4682B4', // Example secondary color (SteelBlue)
        // Add more custom colors as needed
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example sans-serif font
        mono: ['Roboto Mono', 'monospace'], // Example monospace font
        // Add more custom fonts as needed
      },
    },
  },
  plugins: [],
};
export default config;
