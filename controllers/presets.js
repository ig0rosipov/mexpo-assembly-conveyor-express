const Preset = require('../models/preset');

module.exports.getAllPresets = (req, res) => {
  Preset.find({})
    .then((presetList) => {
      res.send(presetList);
    })
    .catch((err) => res.send(err));
};

module.exports.addPreset = (req, res) => {
  const { name, runTime, stopTime } = req.body;
  Preset.create({ name, runTime, stopTime })
    .then((preset) => {
      res.send(preset);
    })
    .catch((err) => res.send(err));
};

module.exports.deletePreset = (req, res) => {
  Preset.findOneAndDelete({ _id: req.params.presetId })
    .then((deletedPreset) => {
      res.send(deletedPreset);
    })
    .catch((err) => res.send(err));
};
