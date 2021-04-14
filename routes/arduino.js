const arduinoRouter = require('express').Router();
const { emergency, sensor } = require('../controllers/arduino');

arduinoRouter.get('/api/emergency', emergency);
arduinoRouter.get('/api/sensor', sensor);

module.exports = arduinoRouter;
