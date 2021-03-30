module.exports.emergency = (req, res, next) => {
  req.arduino = {
    status: 'emergency',
  };

  res.send({
    status: 'emergency',
  });
  next();
};

module.exports.sensor = (req, res, next) => {
  req.arduino = {
    status: 'sensor',
  };

  res.send({
    staus: 'sensor',
  });

  next();
};
