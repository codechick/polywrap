var gulp = require('gulp'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig = require('./webpack.config'),
    del = require('del'),
    path = require('path'),
    shell = require('gulp-shell');

gulp.task('default', ['webpack-dev-server']);

gulp.task('build-prod', ['clean-build', 'build-prod-webpack'])

gulp.task('clean-build', function () {
    return del.sync([path.join(__dirname, 'build','/**/*')]);
});

gulp.task('build-prod-webpack', shell.task([
    'NODE_ENV=prod webpack --progress --colors --config ./webpack.config.js'
]));

gulp.task('webpack-dev-server', function() {
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;
  myConfig.entry = {app: [`webpack-dev-server/client?http://localhost:${myConfig.serverConfig.port}/`, "webpack/hot/dev-server", "./index"]};

  new WebpackDevServer(webpack(myConfig), {
    publicPath: myConfig.serverConfig.publicPath,
    contentBase: myConfig.serverConfig.contentBase,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false
    },
    historyApiFallback: true
  }).listen(myConfig.serverConfig.port, 'localhost', function(err, result) {
    if (err) {
      console.log(err);
    }

    console.log(`Listening at localhost:${myConfig.serverConfig.port}`);
  });

});
