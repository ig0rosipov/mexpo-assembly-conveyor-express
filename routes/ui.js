const uiRouter = require('express').Router();
const { run, stop, setTime } = require('../controllers/ui');

uiRouter.get('/run', run);
uiRouter.get('/stop', stop);
uiRouter.post('/set-time', setTime);

module.exports = uiRouter;
