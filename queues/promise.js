const captureTrace = require("../server/trace").trace;

let microtasks = [];

function resolve(cb) {
  let trace = captureTrace("Promise.resolve");

  microtasks.push({
    cb,
    trace
  });
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
