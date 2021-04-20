const arduinoRouter = require('express').Router();
const { emergency, sensor, manual } = require('../controllers/arduino');

arduinoRouter.get('/api/emergency', emergency);
arduinoRouter.get('/api/sensor', sensor);
arduinoRouter.get('/api/manual', manual);

module.exports = arduinoRouter;
