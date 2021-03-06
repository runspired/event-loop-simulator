let TOTAL_CYCLES = 0;
let SKIPPED_CYCLES = 0;
// 60fps
let NEXT_RENDER_DEADLINE = Date.now() + 16;
let programIsStale = true;
const MAX_CYCLES = 10;
const flushAnimate = require("./queues/animate").flush;
const hasAnimationCallbacks = require("./queues/animate").hasPendingCallbacks;
const flushTimer = require("./queues/timeout").flush;
const exec = require("./server/exec");
const renderContentRetained = require("./modes/retained");
const renderContentImmediate = require("./modes/immediate");
const createTask = require("./server/task");

let programSrc = process.argv[2] || "../program";
const program = require(programSrc);

const renderContent =
  process.env.RETAINED_RENDER_MODE === "true"
    ? renderContentRetained
    : renderContentImmediate;

const state = exec(createTask(program, "App Load"));

while (TOTAL_CYCLES < MAX_CYCLES && SKIPPED_CYCLES < MAX_CYCLES) {
  let cycleStart = Date.now();

  if (programIsStale && NEXT_RENDER_DEADLINE <= cycleStart) {
    const didRender = render(state);
    programIsStale = hasAnimationCallbacks();
    NEXT_RENDER_DEADLINE = Date.now() + 16;

    if (didRender) {
      TOTAL_CYCLES++;
    } else {
      console.log("skipped render");
      SKIPPED_CYCLES++;
    }
  } else {
    let stateUpdated = flushTimer();
    programIsStale = programIsStale || stateUpdated;
  }
}

function render(state) {
  flushAnimate();
  return renderContent(state, {
    NEXT_RENDER_DEADLINE,
    TOTAL_CYCLES
  });
}
