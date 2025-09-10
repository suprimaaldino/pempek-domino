/** @type {import('tailwindcss').Config} */
const animate = require("tailwindcss-animate");

let defaultConfig = {};
try {
  // try package subpath used by some shadcn installs
  defaultConfig = require("shadcn/ui/tailwind.config");
} catch (e) {
  // do NOT require the package root (it may run the CLI). fallback to empty config.
  defaultConfig = {};
  console.warn("shadcn/ui/tailwind.config not found — using empty defaultConfig.");
}

module.exports = {
  ...defaultConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...(defaultConfig.theme?.extend || {}),
      colors: {
        ...((defaultConfig.theme && defaultConfig.theme.extend && defaultConfig.theme.extend.colors) || {}),
        // Add the missing CSS variable-based colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          ...(((defaultConfig.theme && defaultConfig.theme.extend && defaultConfig.theme.extend.colors && defaultConfig.theme.extend.colors.primary) || {})),
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#fef7ee",
          100: "#fdedd6",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          900: "#9a3412",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [...(Array.isArray(defaultConfig.plugins) ? defaultConfig.plugins : []), animate],
};