const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  runTime: {
    type: String,
    required: true,
  },
  stopTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('preset', presetSchema);
