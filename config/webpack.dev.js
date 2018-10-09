const path = require('path');
const merge = require('webpack-merge');
const apiMocker = require('webpack-api-mocker');

const { getContentBaseConfig, clearConsole, consoleServer } = require('./webpack.func.js');
const getCommonConfig = require('./webpack.common.js');

module.exports = merge(getCommonConfig(false), {
	devServer: {
		contentBase: getContentBaseConfig(),
		open: true,
		hot: true,
		host: '0.0.0.0',
		useLocalIp: true,
		//clientLogLevel: 'none',
		stats: 'errors-only',
		before(app) {
			apiMocker(app, path.resolve('./mock/index'), {
			  proxy: {
			    '/repos//*': 'https://api.github.com/',
			  },
			  changeHost: true,
			})
		},
		after(app) {
			setTimeout(() => {
				clearConsole();
  			consoleServer();
			}, 1500);
		}
	}
});