/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                void: '#070B14',
                surface: {
                    0: '#0D1117',
                    1: '#141B27',
                    2: '#1C2537'
                },
                border: {
                    subtle: '#1F2D45',
                    bright: '#2E4068'
                },
                text: {
                    primary: '#E8EDF5',
                    secondary: '#8A9BB5',
                    muted: '#4A5A75'
                },
                scanner: {
                    DEFAULT: '#00E5CC',
                    dim: 'rgba(0, 229, 204, 0.12)'
                },
                escrow: '#3B82F6',
                success: '#10B981',
                warning: '#FBBF24',
                danger: '#EF4444',
                tier: {
                    clear:     '#22C55E',
                    clouded:   '#EAB308',
                    disturbed: '#F97316',
                    criminal:  '#EF4444',
                    gold:      '#F59E0B',
                }
            },
            textColor: {
                primary: '#E8EDF5',
                secondary: '#8A9BB5',
                muted: '#4A5A75'
            },
            backgroundColor: {
                void: '#070B14',
            },
            borderColor: {
                subtle: '#1F2D45',
                bright: '#2E4068'
            },
            fontFamily: {
                display: ['var(--font-zen-antique)', 'serif'],
                body: ['var(--font-syne)', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'monospace']
            }
        },
    },
    plugins: [],
};
