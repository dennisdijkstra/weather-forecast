const HtmlWebPackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            sourceMap: true,
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    output: {
        publicPath: '/',
    },
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:5000',
        },
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './client/src/index.html',
            filename: './index.html',
        }),
        new StyleLintPlugin({
            files: ['src/**/*.css'],
        }),
    ],
};
