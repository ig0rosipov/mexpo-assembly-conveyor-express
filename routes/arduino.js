const arduinoRouter = require('express').Router();
const { emergency } = require('../controllers/arduino');

arduinoRouter.get('/emergency', emergency);

module.exports = arduinoRouter;
