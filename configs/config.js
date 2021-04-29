const currentIp = '192.168.25.88';

const addresses = {
  mainApi: `http://${currentIp}/api`,
  arduinoUrl: 'http://192.168.64.254',
  mainAddress: `http://${currentIp}`,
  socketIoPath: '/api/socket.io',
};

module.exports.config = {
  socketIoPath: addresses.socketIoPath,
  allowedUrls: [
    'http://lvh.me:3000',
    'http://localhost:3000',
    addresses.mainAddress,
    addresses.arduinoUrl,
  ],
};
