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
                'primary-strong': '#FF8A00',
                'secondary-foreground': '#545454',
                kakao: '#FEE500',
                google: '#FFFFFF',
                naver: '#03C75A',

                label: {
                    normal: '#222222',
                    strong: '#000000',
                    neutral: '#545454',
                    alternative: '#888888',
                    assistive: '#999999',
                    disabled: '#BBBBBB',
                },
                line: {
                    normal: '#E4E4E4',
                    alternative: 'F6F6F6',
                },
                status: {
                    destructive: '#E82626',
                    positive: '#FF9900',
                },
                fill: {
                    normal: '#F2F2F2',
                    disabled: '#E5E5E5',
                },
                dimmer: '#222222',
                shadow: {
                    normal: '#FFFFFF',
                },
            },
            fontFamily: {
                roboto: ['"Roboto"', 'sans-serif'],
            },
            animation: {
                mainToLeft: 'mainToLeft 0.25s ease-in-out',
                mainToRight: 'mainToRight 0.25s ease-in-out ',
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
                    '66%': { opacity: 1 },
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
