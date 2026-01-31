/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Official SAT Connect Brand Colors
                brand: {
                    primary: '#001AED',      // SAT Connect Primary Blue
                    white: '#FFFFFF',
                    gray: '#F3F7FB',         // Light Gray
                    black: '#000000',
                    dark: '#0f172a',         // Dark background
                    darker: '#020617',       // Darker sections
                    surface: '#1e293b',      // Card backgrounds
                    border: '#334155',       // Subtle borders
                },
                // Bókun New Branding (2026) - Neon Green
                bokun: {
                    green: '#00FF66',        // Neon green from new branding
                    'green-dark': '#00CC52',
                    'green-light': '#33FF85',
                },
                // Accent colors for UI elements
                accent: {
                    cyan: '#00d2ff',
                    blue: '#3a7bd5',
                },
                neon: {
                    mint: '#00f2ff',
                    green: '#00FF66',        // Bókun
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
