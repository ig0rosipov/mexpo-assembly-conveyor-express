const Preset = require('../models/preset');

module.exports.getAllPresets = (req, res, next) => {
  Preset.find({})
    .then((presetList) => {
      res.send(presetList);
    })
    .catch((err) => res.send(err));
};

module.exports.addPreset = (req, res, next) => {
  const { name, runTime, stopTime } = req.body;
  Preset.create({ name, runTime, stopTime })
    .then((preset) => {
      res.send(preset);
    })
    .catch((err) => res.send(err));
};

module.exports.deletePreset = (req, res, next) => {
  Preset.findOneAndDelete({ _id: req.params.presetId })
    .then((deletedPreset) => {
      res.send(deletedPreset);
    })
    .catch((err) => res.send(err));
};
