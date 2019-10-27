const shouldCapture = process.env.CAPTURE_ASYNC_TRACES === "true";
const ASYNC_CALL_STACK = [];
let traceId = 0;

function trace(type) {
  if (shouldCapture) {
    let id = traceId++;
    try {
      throw new Error(`-------- (async) @ ${type} (${id}) --------`);
    } catch (e) {
      let lines = e.stack.split("\n");
      lines[0] = e.message;
      e.stack = lines.join("\n");
      e.traceId = id;
      e.traces = ASYNC_CALL_STACK.splice(0);
      return e;
    }
  }
}

const INTERNAL_MODULES = [
  "event-loop-simulator/server.js",
  "event-loop-simulator/queues/animate.js",
  "event-loop-simulator/queues/promise.js",
  "event-loop-simulator/server/trace.js",
  "event-loop-simulator/server/exec.js",
  "event-loop-simulator/server/task.js",
  "internal/modules/cjs/loader.js"
];

function filterInternalModulesFromTrace(trace) {
  let lines = trace.stack.split("\n");
  let filtered = lines.filter(line => {
    for (let i = 0; i < INTERNAL_MODULES.length; i++) {
      if (line.indexOf(INTERNAL_MODULES[i]) !== -1) {
        return false;
      }
    }
    return true;
  });
  trace.stack = filtered.join("\n");
  return trace;
}

function stitch(error, trace) {
  if (shouldCapture) {
    let traces = [trace];
    for (let i = 0; i < traces.length; i++) {
      let currentTrace = traces[i];
      if (currentTrace) {
        traces.push(...currentTrace.traces);
      }
    }

    traces.unshift(error);

    error.stack = traces
      .filter(t => t)
      .map(t => t.stack)
      .join("\n");
  }

  return filterInternalModulesFromTrace(error);
}

module.exports = {
  ASYNC_CALL_STACK,
  shouldCapture,
  trace,
  stitch
};
