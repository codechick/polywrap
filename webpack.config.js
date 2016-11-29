var path = require('path'),
    webpack = require('webpack'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    WebpackStripLoader = require('strip-loader');

const webpack_config = {
  context: path.join(__dirname, 'src'),
  entry: './lib/Polywrap',
  output: {
    path: path.join(__dirname, 'build'),
    chunkFilename: '[id].bundle.js',
    filename: 'Polywrap.js'
  },
  plugins: [],
  module: {
    resolve: {
        extensions: ['']
    },
    loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: path.join(__dirname, './src'),
            query : {
              presets: ['es2015'],
            }
        }
    ]
  }
};

//
// Environment-specific confs
//
switch (process.env.NODE_ENV) {
  case "prod":
      console.warn("Prod mode");

      var stripLoader = {
            test: [/\.js$/],
            exclude: /node_modules/,
            loader: WebpackStripLoader.loader('console.log')
        };

      webpack_config.module.loaders.push(stripLoader);

      webpack_config.plugins.push(
          new webpack.DefinePlugin({
              'process.env': {
                  NODE_ENV: JSON.stringify('production')
              }
          })
      );

      webpack_config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            include: /\.js$/,
            compress: {
                warnings: false
            }
        })
      );
      break;
    case "dev":
      console.warn("Dev mode");
      webpack_config.entry.app = ['./index'];
      webpack_config.output.filename = 'app.js';

      webpack_config.plugins.push(new CopyWebpackPlugin([
          { from: 'index.html', to: 'index.html' },
          { from: '../node_modules/babel-polyfill/dist/polyfill.min.js', to: 'es5-polyfill.js' }
      ]));

      webpack_config.plugins.push(new webpack.HotModuleReplacementPlugin())

      webpack_config.serverConfig = {
        port: '8000',
        publicPath: '/',
        contentBase: 'build/'
      };
      break;
}

module.exports = webpack_config;
