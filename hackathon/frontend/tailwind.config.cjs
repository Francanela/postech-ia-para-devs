module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:  '#1E40AF', // indigo-900
        secondary:'#0EA5E9', // sky-400
        accent:   '#22C55E', // emerald-500
        surface:  '#F3F4F6', // gray-100
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Roboto Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-headings': theme('colors.primary'),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
