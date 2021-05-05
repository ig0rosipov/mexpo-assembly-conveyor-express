const heartbeats = require('heartbeats');
const io = require('socket.io');
const config = require('../configs/config');
const decreaseTimer = require('./timer');

let serverRunTime = [0, 0, 5];
let serverStopTime = [0, 0, 10];
let timer = [0, 0, 5];
let phase = 'starting';
let isPauseButtonPressed = true;
let isEmergencyButtonPressed = false;
let isEmergencySensorReleased = false;
let isManualModeEnabled = false;
let isPhaseChangeAllowed = false;

const changePhase = (currentPhase) => {
  switch (currentPhase) {
    case 'starting':
      timer = serverStopTime;
      phase = 'production';
      break;
    case 'production':
      timer = serverRunTime;
      phase = 'running';
      break;
    case 'running':
      timer = serverStopTime;
      phase = 'production';
      break;
    default:
      break;
  }
  isPhaseChangeAllowed = false;
};

const isTimerFinished = (currentTime) => {
  const [hours, minutes, seconds] = currentTime;

  if (hours <= 0 && minutes <= 0 && seconds <= 0) {
    return true;
  }

  return false;
};

const tick = (ioServer) => {
  if (isTimerFinished(timer)) {
    console.log(isPhaseChangeAllowed);
    if (isPhaseChangeAllowed) {
      changePhase(phase);
    }
  } else {
    timer = decreaseTimer(timer);
  }
  console.log(timer, phase);
  ioServer.sockets.emit('time', {
    currentTime: timer,
    phase,
    emergency: isEmergencyButtonPressed,
    sensor: isEmergencySensorReleased,
    manual: isManualModeEnabled,
  });
};

const startTimer = (heart, ioServer) => {
  heart.createEvent(1, () => {
    if (
      isPauseButtonPressed
      || isEmergencyButtonPressed
      || isEmergencySensorReleased
      || isManualModeEnabled
    ) {
      ioServer.sockets.emit('time', {
        currentTime: timer,
        phase,
        emergency: isEmergencyButtonPressed,
        sensor: isEmergencySensorReleased,
        manual: isManualModeEnabled,
      });
      heart.killAllEvents();
    } else {
      tick(ioServer);
    }
  });
};

module.exports = (req, res, next) => {
  const heart = heartbeats.createHeart(1000);
  const ioServer = io(req.server, {
    cors: {
      origin: [
        'http://lvh.me:3000',
        'http://localhost:3000',
        'ws://localhost:3000',
        'http://localhost:5000',
        'ws://localhost:5000',
        'http://192.168.64.254',
        'ws://192.168.64.254',
        '192.168.64.254',
        'http://192.168.64.3',
        '192.168.64.3',
      ],
    },
    path: '/api/socket.io',
  });

  if (req.arduino) {
    if (req.arduino.status === 'emergency') {
      console.log('EMERGENCY');
      isEmergencyButtonPressed = true;
    }
    if (req.arduino.status === 'sensor') {
      console.log('SENSOR');
      isEmergencySensorReleased = true;
    }
    if (req.arduino.status === 'manual') {
      console.log('MANUAL');
      isManualModeEnabled = true;
    }
  }
  ioServer.on('connection', (socket) => {
    console.log('connected ', socket.id);

    socket.on('changePhase', (isAllowed) => {
      isPhaseChangeAllowed = isAllowed;
    });

    socket.on('pauseState', (state) => {
      isPauseButtonPressed = state;
      if (state === true) {
        heart.killAllEvents();
      } else {
        heart.killAllEvents();
        startTimer(heart, ioServer);
      }
    });

    socket.on('timerState', (state) => {
      isPauseButtonPressed = state;
      isManualModeEnabled = state;
      if (state === true) {
        heart.killAllEvents();
      } else {
        heart.killAllEvents();
        startTimer(heart, ioServer);
      }
    });

    socket.on('resetAlarm', () => {
      isEmergencyButtonPressed = false;
      isEmergencySensorReleased = false;
      ioServer.sockets.emit('time', {
        currentTime: timer,
        phase,
        emergency: isEmergencyButtonPressed,
        sensor: isEmergencySensorReleased,
        manual: isManualModeEnabled,
      });
    });

    socket.on('changeTimer', (clientData) => {
      const { runTime, stopTime } = clientData;
      console.log(runTime, stopTime);
      serverRunTime = runTime;
      serverStopTime = stopTime;
      phase = 'starting';
      timer = [0, 0, 3];
      isPauseButtonPressed = false;
      heart.killAllEvents();
      startTimer(heart, ioServer);
    });
  });
  startTimer(heart, ioServer);
  next();
};
