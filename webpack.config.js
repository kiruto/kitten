// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader');
var webpack = require('webpack');

let prefix;
let filename;
let conf = require('./config/flapper.config.js');
let plugins = [];

if (conf.debug) {
  prefix = ".js";
  filename = "bundle.js";
} else {
  prefix = ".prod.js";
  plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        minimize: true
      })
  );
  filename = "bundle.min.js";
}
let env = require(`./config/environment${prefix}`);

plugins = plugins.concat([
  new CheckerPlugin(),
  // new TsConfigPathsPlugin(),
  new webpack.DefinePlugin({
    __IN_DEBUG__: JSON.stringify(conf.debug),
    __VERSION__: JSON.stringify(`${conf.version}.${Date.now()}`),
    __ENVIRONMENT__: JSON.stringify(env.environment)
  })
]);

module.exports = {
  entry: {
    main: './src/index.ts'
  },

  output: {
    filename: `./dist/${filename}`
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: plugins
};