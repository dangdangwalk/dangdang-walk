const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#ff9900',
                'primary-foreground': colors.white,
                secondary: '#e4e4e4',
                'secondary-foreground': '#545454',
                kakao: '#FEE500',
                google: '#FFFFFF',
                naver: '#03C75A',
            },
            fontFamily: {
                roboto: ['"Roboto"', 'sans-serif'],
            },
            animation: {
                fadeOut: 'fadeOut 3s forwards',
            },
            keyframes: {
                mainToLeft: {
                    '0%': {
                        transform: 'translateX(0)',
                    },
                    '100%': {
                        transform: 'translateX(-100%)',
                    },
                },
                mainToRight: {
                    '0%': {
                        transform: 'translateX(0)',
                    },
                    '100%': {
                        transform: 'translateX(100%)',
                    },
                },
                fadeOut: {
                    '0%': { opacity: 1 },
                    '70%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
            },
            width: {
                '200vw': '200vw',
            },
        },
    },
    plugins: [],
    safelist: ['animate-fadeOut'],
};
