/**
 * Created by yuriel on 3/6/17.
 */
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader');
var webpack = require('webpack');
var FlapperWebpackConfig = FlapperWebpackConfig || {};

FlapperWebpackConfig.Config = function(isProd) {
    let conf = require('./config/flapper.config.js');
    this.debug = isProd? !isProd: conf.debug;

    let prefix;
    this.plugins = [];

    if (this.debug) {
        prefix = ".js";
        this.filename = "bundle.js";
    } else {
        prefix = ".prod.js";
        this.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false},
                minimize: true
            })
        );
        this.filename = "bundle.min.js";
    }
    let env = require(`./config/environment${prefix}`);

    this.plugins = this.plugins.concat([
        new CheckerPlugin(),
        new webpack.DefinePlugin({
            __IN_DEBUG__: JSON.stringify(this.debug),
            __VERSION__: JSON.stringify(`${conf.version}.${Date.now()}`),
            __ENVIRONMENT__: JSON.stringify(env.environment)
        })
    ]);
};

FlapperWebpackConfig.Config.prototype.export = function () {
    return {
        entry: {
            main: './src/index.ts'
        },

        output: {
            filename: `./dist/${this.filename}`
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
        plugins: this.plugins
    }
};

module.exports = FlapperWebpackConfig;