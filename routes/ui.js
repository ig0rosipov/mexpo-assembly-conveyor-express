const uiRouter = require('express').Router();
const { run, stop, setTime } = require('../controllers/ui');

uiRouter.get('/api/run', run);
uiRouter.get('/api/stop', stop);
uiRouter.post('/api/set-time', setTime);

module.exports = uiRouter;
