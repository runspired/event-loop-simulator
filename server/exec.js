const flushResolve = require("../queues/promise").flush;

module.exports = function executeCallback(cb) {
  let result;
  try {
    result = cb();
  } catch (e) {
    process.exit(e);
  } finally {
    flushResolve();
  }
  return result;
};
