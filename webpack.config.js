const CopyPlugin = require('copy-webpack-plugin');
const fs_path_resolve = require('./src/fs_path_resolve');
const pkg = require('./package.json');
const webpack = require('webpack');

const dev = {
    mode: 'development',
    target: 'web',
    entry: './src/browser/index.js',
    devtool: false,
    output: {
        path: fs_path_resolve(__dirname, 'dist'),
        filename: 'browser.js',
    },
    externals: {
        axios: 'axios',
        bluebird: 'Promise',
        'form-data': 'FormData',
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version),
        }),
        new CopyPlugin({
            patterns: [
                'dist.templ/index.html',
            ],
        }),
    ],
};

module.exports = [dev];
