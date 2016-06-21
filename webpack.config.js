var path = require('path');
var webpack = require('webpack');


var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    entry: {
    	index: ['webpack-dev-server/client?http://127.0.0.1:8083/','webpack/hot/dev-server','babel-polyfill',
    		 './src/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name].js",
        publicPath: 'http://127.0.0.1:8083/build/',
        outputPath: path.join(__dirname, 'dist')
    },
    devServer: {
    	inline:true,
    	hot: true,
    	port: 8083,
    	progress: true,
    	headers: {
            "Access-Control-Allow-Origin": "*",
        },
	    contentBase: './src'
	  },
    resolve: {
    	extensions: ["", ".js",".jsx", ".css", ".styl"],
    },
    module: {
	    loaders: [{
	      test: /\.jsx?$/, 
	      loader: 'babel-loader',
	      exclude:/node_modules/,
	      query:
            {
                presets:['es2015','stage-2']
            }
	    }, {
	      test: /\.css$/, // Only .css files
	      exclude:/node_modules/,
	      // loader: 'style!css',
	      loader: process.env.NODE_ENV == 'production' ?  ExtractTextPlugin.extract("style-loader", "css-loader"): 'style!css' // Run both loaders
	      // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
	    },{
		  test:   /\.styl$/,
	      exclude:/node_modules/,
	      // loader:'style-loader!css-loader!stylus-loader',
		  loader: process.env.NODE_ENV == 'production' ? ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader") : 'style-loader!css-loader!stylus-loader'
        	// loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader")
		}, {
	      test: /\.(png|jpg)$/,
	      exclude:/node_modules/,
	      loader: 'url?limit=25000'
	    }
    ]},
	  stylus: {
		  use: [require('nib')()],
		  import: ['~nib/lib/nib/index.styl']
		},
	  plugins: [
	  	new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoErrorsPlugin()
	    
	   ].concat(process.env.NODE_ENV == 'production' ? new uglifyJsPlugin({
	      compress: {
	        warnings: false
	      }
	    }) : [])
	   .concat(process.env.NODE_ENV == 'production' ? new CopyWebpackPlugin([{from: 'src/*.html'},{from:'build'}]) : [])
};