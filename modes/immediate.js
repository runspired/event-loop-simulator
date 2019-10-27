module.exports = function render(state, info) {
  console.log({
    state: String(state),
    deadline: info.NEXT_RENDER_DEADLINE,
    cycles: info.TOTAL_CYCLES
  });
  return true;
};
