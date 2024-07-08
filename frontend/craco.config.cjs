const cracoAlias = require('craco-alias');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin({
    outputFormat: 'human',
});

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
    webpack: {
        configure: (webpackConfig) => {
            const cssPluginIndex = webpackConfig.plugins.findIndex(
                (e) => e.constructor.name === 'MiniCssExtractPlugin'
            );
            const cssPlugin = webpackConfig.plugins[cssPluginIndex];

            // SpeedMeasurePlugin으로 Webpack 설정 래핑
            const configToExport = smp.wrap(webpackConfig);

            // MiniCssExtractPlugin 다시 추가
            configToExport.plugins[cssPluginIndex] = cssPlugin;

            return configToExport;
        },
    },
};
