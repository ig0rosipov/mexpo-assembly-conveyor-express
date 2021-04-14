const currentIp = '192.168.25.111';

const addresses = {
  mainApi: `http://${currentIp}/api`,
  arduinoUrl: 'http://192.168.24.186',
  mainAddress: `http://${currentIp}`,
  socketIoPath: '/api/socket.io',
};

module.exports.config = {
  socketIoPath: addresses.socketIoPath,
  allowedUrls: [
    'http://lvh.me',
    'http://localhost',
    addresses.mainAddress,
    addresses.arduinoUrl,
  ],
};
