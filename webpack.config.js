/**
 * Created by yuriel on 3/6/17.
 */
let Flapper = require('./flapper.webpack.config');
let flapper = new Flapper.Config();
module.exports = flapper.export();