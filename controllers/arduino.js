module.exports.emergency = (req, res, next) => {
  req.arduino = {
    status: 'emergency',
  };

  res.status(200).send({
    status: 'emergency',
  });
  next();
};

module.exports.sensor = (req, res, next) => {
  req.arduino = {
    status: 'sensor',
  };

  res.status(200).send({
    staus: 'sensor',
  });

  next();
};

module.exports.manual = (req, res, next) => {
  req.arduino = {
    status: 'manual',
  };

  res.status(200).send({
    status: 'sensor',
  });

  next();
};
