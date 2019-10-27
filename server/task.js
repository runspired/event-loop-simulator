const createTrace = require("./trace").trace;

module.exports = function createTask(cb, label) {
  let trace = createTrace(label);
  return {
    cb,
    trace
  };
};
