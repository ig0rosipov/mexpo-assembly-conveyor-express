const currentIp = '192.168.64.3';
const arduinoIp = '192.168.64.254';
const devCurrentIp = 'localhost:3000';
const addresses = [
  `http://${devCurrentIp}`,
  `ws://${devCurrentIp}`,
  `http://${currentIp}`,
  `ws://${currentIp}`,
  currentIp,
  `http://${arduinoIp}`,
  arduinoIp,
];

module.exports.corsOptions = {
  origin: [
    `http://${devCurrentIp}`,
    `ws://${devCurrentIp}`,
    `http://${currentIp}`,
    `ws://${currentIp}`,
    currentIp,
    `http://${arduinoIp}`,
    arduinoIp,
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Access-Control-Allow-Headers',
    'Authorization',
    'X-Requested-With',
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports.socketOptions = {
  cors: {
    origin: addresses,
  },
  path: '/api/socket.io',
};
