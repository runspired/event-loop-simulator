let lastState = null;
module.exports = function render(state, info) {
  const newState = String(state);
  if (newState !== lastState) {
    lastState = newState;
    console.log({
      state: newState,
      deadline: info.NEXT_RENDER_DEADLINE,
      cycles: info.TOTAL_CYCLES
    });
    return true;
  }
  return false;
};
