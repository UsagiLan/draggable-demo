const path = require('path');

const { getFangfeConfig, getEntryConfig, getRulesConfig, getPluginsConfig } = require('./webpack.func.js');
const { webpackConfig } = getFangfeConfig();
module.exports = function(isProduction) {
  let codeMinimize = (webpackConfig.minimize && isProduction) ? true : false;
  return {
    mode: isProduction ? 'production' : 'development',
    stats: {
      children: false,
      entrypoints: false,
      modules: false,
      errors: true,
      errorDetails: true,
    },
    entry: getEntryConfig(isProduction),
    output: {
      publicPath: '/',
      filename: '[name]index.js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, '../build')
    },
    optimization: {
      minimize: codeMinimize,
      occurrenceOrder: true,
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        name: false,
        cacheGroups: {
          vendor: {
            name: 'vendor/vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: false,
          },
        }
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.vue', '.json', '.css'],
      alias: {
        //'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),
        '@': path.resolve(__dirname, '../src')
      }
    },
    module: {
      noParse: function (content) {
        //return /jquery|lodash|webpack-zepto/.test(content);
        return /Zepto|zepto|jQuery|WBAPP/.test(content);
      },
      rules: getRulesConfig(isProduction)
    },
    plugins: getPluginsConfig(isProduction)
  }
};