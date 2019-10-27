const createTask = require("../server/task");

let microtasks = [];

function resolve(cb) {
  microtasks.push(createTask(cb, "Promise.resolve"));
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
