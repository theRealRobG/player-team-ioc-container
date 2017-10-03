const webpack = require('webpack');
const path = require('path');

const config = {
    devtool: 'inline-sourcemap',
    entry: './index.ts',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.min.js',
        publicPath: '/dist/'
    },
    plugins: [],
    module: {
        loaders: [
            {test: /\.(j|t)s$/, exclude: /node_modules/, loaders: ['babel-loader', 'ts-loader?transpileOnly=true']}
        ]
    }
};

module.exports = config;