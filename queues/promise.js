let microtasks = [];

function resolve(cb) {
  microtasks.push(cb);
}

function flush() {
  while (microtasks.length) {
    let task = microtasks.shift();
    task();
  }
}

module.exports = {
  resolve,
  flush
};
