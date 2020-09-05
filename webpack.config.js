const path = require("path")
const WebpackBar = require('webpackbar')

module.exports = {
	mode: 'production',
	optimization: {
		minimize: true,
	},
	entry: {
		index: './src/main.js',
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|dist|samples|test|.cache)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		],
	},
	plugins:[
		new WebpackBar({
			name: 'PuffinJS',
		})
	],
	target: 'web',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd',
	}
}
