const presetRouter = require('express').Router();
const { getAllPresets, addPreset, deletePreset } = require('../controllers/presets');

presetRouter.get('/presets', getAllPresets);
presetRouter.post('/presets', addPreset);
presetRouter.delete('/presets/:presetId', deletePreset);

module.exports = presetRouter;
