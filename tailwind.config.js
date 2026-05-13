/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                safesight: {
                    50: '#f0fdfa',
                    500: '#14b8a6',
                    700: '#0f766e',
                    900: '#134e4a',
                },
                cyber: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    900: '#164e63',
                },
                security: {
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        }
    },
    plugins: [],
};