const io = require('socket.io');
const heartbeats = require('heartbeats');
const timer = require('./timer');

// eslint-disable-next-line consistent-return
const changePhase = (runTime, stopTime, phase, prevPhase) => {
  switch (phase) {
    case 'starting':
      return {
        currentTime: [...stopTime],
        phase: 'production',
        prevPhase: prevPhase === null ? 'running' : phase,
        bufferPhase: 'production',
      };
    case 'production':
      return {
        currentTime: [...runTime],
        phase: 'running',
        prevPhase: phase,
        bufferPhase: 'running',
      };
    case 'running':
      return {
        currentTime: [...stopTime],
        phase: 'production',
        prevPhase: phase,
        bufferPhase: 'production',
      };
    case 'emergency':
      return {
        currentTime: [0, 0, 3],
        phase: 'starting',
        prevPhase: phase,
        bufferPhase: 'starting',
      };
    default:
      break;
  }
};

let timeData;
let timerSetup;
let isTimerPaused = false;
let isClientDataSended = false;

const ticker = (socket) => {
  if (isClientDataSended) {
    console.log(`tick ${timeData.currentTime}`);
    timeData = timer({ ...timeData }, isTimerPaused);
    if (timeData.status && timeData.status === 'done') {
      timeData = changePhase(
        timerSetup.runTime,
        timerSetup.stopTime,
        timeData.phase,
        timeData.prevPhase,
      );
    }
    socket.emit('time', timeData);
  }
};

const changeTimerState = (heart, state, socket) => {
  heart.killAllEvents();
  isTimerPaused = state;
  if (!state) {
    heart.createEvent(1, () => {
      ticker(socket);
    });
  }
};

const resetAlarm = (heart, socket) => {
  heart.killAllEvents();
  timeData = {
    ...timeData,
    phase: timeData.bufferPhase,
  };
  socket.emit('time', timeData);
};

const updateTimer = (heart, socket, clientData) => {
  heart.killAllEvents();
  const {
    runTime, stopTime, currentTime, phase,
  } = clientData;

  timerSetup = {
    runTime,
    stopTime,
  };

  timeData = {
    currentTime,
    phase,
    prevPhase: null,
    bufferPhase: phase,
  };

  isClientDataSended = true;
  console.log(isClientDataSended);
  heart.createEvent(1, () => {
    ticker(socket);
  });
};

const connectSocket = (heart, socket) => {
  heart.killAllEvents();
  console.log('connected ', socket.id);
  heart.createEvent(1, () => {
    ticker(socket);
  });
  socket.on('timerState', (state) => {
    changeTimerState(heart, state, socket);
  });

  socket.on('resetAlarm', () => {
    resetAlarm(heart, socket);
  });

  socket.on('changeTimer', (clientData) => {
    updateTimer(heart, socket, clientData);
  });
};

module.exports = (req, res, next) => {
  const heart = heartbeats.createHeart(1000);
  const ioServer = io(req.server, {
    cors: {
      origin: '*',
    },
  });

  if (req.arduino && req.arduino.status === 'emergency') {
    console.log('EMERGENCY');
    isTimerPaused = true;
    heart.killAllEvents();

    timeData = {
      ...timeData,
      phase: 'emergency',
    };
  }
  ioServer.on('connection', (socket) => {
    connectSocket(heart, socket);
  });
  next();
};
