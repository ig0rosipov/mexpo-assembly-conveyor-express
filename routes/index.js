const indexRouter = require('express').Router();
const arduino = require('./arduino');
const ui = require('./ui');
const presets = require('./presets');

indexRouter.use(arduino);
indexRouter.use(ui);
indexRouter.use(presets);

module.exports = indexRouter;
