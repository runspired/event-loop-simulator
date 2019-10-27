const createTask = require("../server/task");

let microtasks = [];

function resolve(cb) {
  let task = createTask(cb, "Promise.resolve");
  microtasks.push(task);
  return () => task.cancel();
}

function flush() {
  const exec = require("../server/exec");
  while (microtasks.length) {
    let task = microtasks.shift();
    exec(task);
  }
}

module.exports = {
  resolve,
  flush
};
