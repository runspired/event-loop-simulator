const flushResolve = require("../queues/promise").flush;
const stitch = require("./trace").stitch;
const ASYNC_CALL_STACK = require("./trace").ASYNC_CALL_STACK;

module.exports = function executeCallback(task) {
  if (task.cancelled) {
    console.log("Skipping PID:" + task._id);
    return;
  }
  ASYNC_CALL_STACK.push(task);
  let result;
  try {
    result = task.cb();
  } catch (e) {
    e = stitch(e, task.trace);
    task.cancel();

    if (process.env.LOG_ERRORS === "true") {
      console.log(e.message);
      console.log(e.stack);
    }
  } finally {
    flushResolve();
  }
  ASYNC_CALL_STACK.shift();
  return result;
};
