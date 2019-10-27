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
  let task = createTask(cb, "requestAnimationFrame");
  currentFrame.push(task);
  return () => task.cancel();
}

module.exports = {
  animate,
  flush,
  hasPendingCallbacks
};
