const io = require('socket.io');
const heartbeats = require('heartbeats');
const timer = require('./timer');

// eslint-disable-next-line consistent-return
const changePhase = (runTime, stopTime, phase) => {
  const production = {
    currentTime: [...stopTime], phase: 'production',
  };

  const running = {
    currentTime: [...runTime], phase: 'running',
  };

  switch (phase) {
    case 'starting':
      return production;
    case 'production':
      return running;
    case 'running':
      return production;
    default:
      break;
  }
};

module.exports = (req, res, next) => {
  let timeData;
  let isTimerPaused = false;
  const ioServer = io(req.server, {
    cors: {
      origin: '*',
    },
  });
  const heart = heartbeats.createHeart(1000);
  ioServer.on('connection', (socket) => {
    console.log('connected');
    socket.emit('timer', timeData);

    socket.on('timerState', (state) => {
      isTimerPaused = state;
      heart.killAllEvents();
    });
    socket.on('subscribeToTimer', (clientData) => {
      const {
        runTime, stopTime, currentTime, phase,
      } = clientData;

      timeData = {
        currentTime,
        phase,
      };

      heart.createEvent(1, () => {
        timeData = timer({ ...timeData }, isTimerPaused);
        if (timeData.status && timeData.status === 'done') {
          timeData = changePhase(runTime, stopTime, timeData.phase);
        }
        socket.emit('timer', timeData);
      });
    });
  });
  next();
};
