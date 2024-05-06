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
        },
    },
    plugins: [],
};
