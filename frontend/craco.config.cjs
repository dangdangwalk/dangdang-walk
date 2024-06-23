const cracoAlias = require('craco-alias');

module.exports = {
    plugins: [
        {
            plugin: cracoAlias,
            options: {
                source: 'tsconfig',
                baseUrl: '.',
                tsConfigPath: 'tsconfig.paths.json',
                debug: false,
            },
        },
    ],
    babel: {
        plugins: [
            ...(process.env.NODE_ENV === 'production'
                ? [['babel-plugin-react-remove-properties', { properties: ['data-testid'] }]]
                : []),
        ],
    },
};
