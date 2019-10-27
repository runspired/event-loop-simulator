let pendingTimers = [];
const exec = require("../server/exec");

function flush() {
  let time = Date.now();
  let nextTimer = pendingTimers[0];

  if (nextTimer && nextTimer.time <= time) {
    exec(nextTimer.cb);
    pendingTimers.shift();
    return true;
  }
  return false;
}

function setTimeout(cb, ms = 0) {
  let time = Date.now() + ms;
  let timer = { cb, time };
  insertTimer(timer);
}

function insertTimer(timer) {
  for (let i = 0; i < pendingTimers.length; i++) {
    let nextTimer = pendingTimers[i];
    if (nextTimer.time >= timer.time) {
      pendingTimers.splice(i, 0, timer);
      return;
    }
  }
  pendingTimers.push(timer);
}

module.exports = {
  setTimeout,
  flush
};
