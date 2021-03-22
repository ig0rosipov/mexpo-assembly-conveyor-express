module.exports.emergency = (req, res, next) => {
  req.arduino = {
    status: 'emergency',
  };

  res.send({
    status: 'emergency',
  });
  next();
};
