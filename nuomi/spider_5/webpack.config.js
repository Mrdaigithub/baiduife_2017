"use strict";

const path = require('path')

module.exports = {
    entry: `${__dirname}/static/js/index.js`,
    output: {
        path: path.resolve(__dirname, 'static/js'),
        filename: 'index.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ["es2015"]
                },
            }
        ]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
        }
    }
}