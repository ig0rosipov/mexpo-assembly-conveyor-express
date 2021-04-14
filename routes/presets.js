const presetRouter = require('express').Router();
const { getAllPresets, addPreset, deletePreset } = require('../controllers/presets');

presetRouter.get('/api/presets', getAllPresets);
presetRouter.post('/api/presets', addPreset);
presetRouter.delete('/api/presets/:presetId', deletePreset);

module.exports = presetRouter;
