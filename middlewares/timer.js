module.exports = ({
  currentTime, phase, prevPhase, bufferPhase,
}, isPaused) => {
  const [hours, minutes, seconds] = currentTime;
  const timer = {
    hours, minutes, seconds, phase, prevPhase,
  };

  if (timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0) {
    return {
      status: 'done',
      phase,
      timer,
    };
  }

  if (timer.hours > 0 && timer.minutes <= 0 && timer.seconds <= 0) {
    timer.hours -= 1;
    timer.minutes = 60;
  }
  if (timer.minutes > 0 && timer.seconds <= 0) {
    timer.minutes -= 1;
    timer.seconds = 60;
  }
  if (timer.seconds > 0 && !isPaused) {
    timer.seconds -= 1;
  }

  return {
    currentTime: [timer.hours, timer.minutes, timer.seconds],
    phase: timer.phase,
    prevPhase,
    bufferPhase,
  };
};
