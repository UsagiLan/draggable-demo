var webpack = require('webpack')
var path = require('path')
const config = require('../config/');
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var prodConf = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [require('postcss-cssnext')()],
                    extractCSS: config.build.extractCSS
                }
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin({
            filename: config.build.cssFileName,
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

if (config.build.publicPath) {
    prodConf.output = {
        publicPath: config.build.publicPath,
    }
}

if (config.build.uglify) {
    prodConf.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );
}

if (config.build.compressCss) {
    prodConf.plugins.push(
        new OptimizeCSSPlugin()
    );
}


if (config.build.extractCSS) {
    prodConf.module.rules.unshift(
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader'],
                fallback: 'vue-style-loader',
            })
        }
    )
} else {
    prodConf.module.rules.unshift(
        {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        }
    )
}

module.exports = merge(baseWebpackConfig, prodConf)