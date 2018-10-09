var path = require('path')
var webpack = require('webpack')
const config = require('../config/');
module.exports = {
    externals: [
        {
            "vue": "commonjs2 vue", // "./f" is external `module.exports = require("./a/b")`
        },
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /(node_modules|bower_components)/,
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: config.imgBase64Limit,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
        ]
    },
}