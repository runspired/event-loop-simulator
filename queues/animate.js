let currentFrame = [];
const exec = require("../server/exec");
const captureTrace = require("../server/trace").trace;

function hasPendingCallbacks() {
  return currentFrame.length > 0;
}

function flush() {
  let toExec = currentFrame;
  currentFrame = [];

  for (let i = 0; i < toExec.length; i++) {
    exec(toExec[i]);
  }
}

function animate(cb) {
  let trace = captureTrace("requestAnimationFrame");

  currentFrame.push({
    cb,
    trace
  });
}

module.exports = {
  animate,
  flush,
  hasPendingCallbacks
};
