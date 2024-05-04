const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            primary: '#ff9900',
            'primary-foreground': colors.white,
            secondary: '#e4e4e4',
            'secondary-foreground': '#545454',
            black: '#000000',
            zinc: {
                500: '#888888',
            },
        },
        extend: {},
    },
    plugins: [],
};
