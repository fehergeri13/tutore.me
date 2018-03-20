const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        app: './src/index.jsx',
        vendors: ['react', 'react-dom']
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
        proxy: {
            "/api": "http://localhost:3000"
        }
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{loader: "style-loader"}, {loader: "css-loader"}, {loader: "less-loader"}]
            },
            {
                test: /\.js|\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {loader: 'babel-loader',}
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
};

module.exports = config;