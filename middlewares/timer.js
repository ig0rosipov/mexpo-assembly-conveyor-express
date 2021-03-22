module.exports = ({
  currentTime, phase,
}, isPaused) => {
  const [hours, minutes, seconds] = currentTime;
  const timer = {
    hours, minutes, seconds, phase,
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
    timer.minutes = 59;
  }
  if (timer.minutes > 0 && timer.seconds <= 0) {
    timer.minutes -= 1;
    timer.seconds = 59;
  }
  if (timer.seconds > 0 && !isPaused) {
    console.log({
      time: [timer.hours, timer.minutes, timer.seconds],
    });
    timer.seconds -= 1;
  }

  return {
    currentTime: [timer.hours, timer.minutes, timer.seconds], phase: timer.phase,
  };
};
