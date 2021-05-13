const heartbeats = require('heartbeats');
const io = require('socket.io');
const decreaseTimer = require('./timer');
const { socketOptions } = require('../configs/config');

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
    if (isPhaseChangeAllowed) {
      changePhase(phase);
      isPhaseChangeAllowed = false;
      ioServer.sockets.emit('time', {
        currentTime: timer,
        phase,
        emergency: isEmergencyButtonPressed,
        sensor: isEmergencySensorReleased,
        manual: isManualModeEnabled,
      });
    }
  } else {
    timer = decreaseTimer(timer);
    ioServer.sockets.emit('time', {
      currentTime: timer,
      phase,
      emergency: isEmergencyButtonPressed,
      sensor: isEmergencySensorReleased,
      manual: isManualModeEnabled,
    });
  }
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
  const ioServer = io(req.server, socketOptions);

  if (req.arduino) {
    if (req.arduino.status === 'emergency') {
      isEmergencyButtonPressed = true;
    }
    if (req.arduino.status === 'sensor') {
      isEmergencySensorReleased = true;
    }
    if (req.arduino.status === 'manual') {
      isManualModeEnabled = true;
    }
  }
  ioServer.on('connection', (socket) => {
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
      const { runTime, stopTime, currentTime } = clientData;
      serverRunTime = runTime;
      serverStopTime = stopTime;
      phase = clientData.phase;
      timer = currentTime;
      isPauseButtonPressed = false;
      heart.killAllEvents();
      startTimer(heart, ioServer);
    });
  });
  startTimer(heart, ioServer);
  next();
};
