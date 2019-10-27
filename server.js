let TOTAL_CYCLES = 0;
// 60fps
let NEXT_RENDER_DEADLINE = Date.now() + 16;
let programIsStale = true;
const MAX_CYCLES = 10;
const program = require("./program");
const flushAnimate = require("./queues/animate").flush;
const hasAnimationCallbacks = require("./queues/animate").hasPendingCallbacks;
const flushTimer = require("./queues/timeout").flush;
const exec = require("./server/exec");

const state = exec(program);

while (TOTAL_CYCLES < MAX_CYCLES) {
  let cycleStart = Date.now();

  if (programIsStale && NEXT_RENDER_DEADLINE <= cycleStart) {
    render(state);
    programIsStale = hasAnimationCallbacks();
    NEXT_RENDER_DEADLINE = Date.now() + 16;

    TOTAL_CYCLES++;
  } else {
    let stateUpdated = flushTimer();
    programIsStale = programIsStale || stateUpdated;
  }
}

function render(state) {
  let renderStart = Date.now();
  flushAnimate();
  console.log({
    state: String(state),
    NEXT_RENDER_DEADLINE,
    TOTAL_CYCLES
  });
  let renderEnd = Date.now();
  return renderEnd - renderStart;
}
