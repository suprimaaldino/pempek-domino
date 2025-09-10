/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        primary: {
          ...defaultConfig.theme.extend.colors.primary,
          50: "#fef7ee",
          100: "#fdedd6",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          900: "#9a3412",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
