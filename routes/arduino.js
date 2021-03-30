const arduinoRouter = require('express').Router();
const { emergency, sensor } = require('../controllers/arduino');

arduinoRouter.get('/emergency', emergency);
arduinoRouter.get('/sensor', sensor);

module.exports = arduinoRouter;
