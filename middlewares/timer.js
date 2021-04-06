module.exports = (currentTime) => {
  let [hours, minutes, seconds] = currentTime;
  if (hours <= 0 && minutes <= 0 && seconds <= 0) {
    return [hours, minutes, seconds];
  }

  if (hours > 0 && minutes <= 0 && seconds <= 0) {
    hours -= 1;
    minutes = 60;
  }
  if (minutes > 0 && seconds <= 0) {
    minutes -= 1;
    seconds = 60;
  }
  if (seconds > 0) {
    seconds -= 1;
  }

  return [hours, minutes, seconds];
};
