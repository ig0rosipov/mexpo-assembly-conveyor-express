const indexRouter = require('express').Router();
const arduino = require('./arduino');
const ui = require('./ui');

indexRouter.use(arduino);
indexRouter.use(ui);

module.exports = indexRouter;
