module.exports.setTime = (req, res, next) => {
  const { stopTime, runTime } = req.body;

  req.uiData = {
    timer: {
      stopTime,
      runTime,
    },
  };

  res.send({
    data: req.body,
  });

  next();
};

module.exports.run = (req, res, next) => {
  req.uiData = {
    status: 'run',
  };

  res.send({
    status: 'run',
  });
  next();
};

module.exports.stop = (req, res, next) => {
  next();
};
