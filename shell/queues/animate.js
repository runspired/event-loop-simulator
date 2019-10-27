let currentFrame = [];
const exec = require("../server/exec");
const createTask = require("../server/task");

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
  currentFrame.push(createTask(cb, "requestAnimationFrame"));
}

module.exports = {
  animate,
  flush,
  hasPendingCallbacks
};
