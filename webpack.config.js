
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    // devtool: 'eval-source-map' // uncomment for dev
}