const createTrace = require("./trace").trace;
const ASYNC_CALL_STACK = require("./trace").ASYNC_CALL_STACK;
let taskId = 0;

function leftPad(str, num = 0, char = " ") {
  while (num-- > 0) {
    str = char + str;
  }
  return str;
}

class Task {
  constructor(cb, label) {
    this._id = taskId++;
    let sLen = ASYNC_CALL_STACK.length;
    let parent = sLen > 0 ? ASYNC_CALL_STACK[sLen - 1] : null;

    // let p = parent;
    // let stack = [];
    // while (p) {
    //   stack.unshift(p._id);
    //   p = p.parent;
    // }
    // stack.push(this._id);
    // for (let i = 0; i < stack.length; i++) {
    //   console.log(`${leftPad("PID:" + stack[i], i)}`);
    // }

    this.cb = cb;
    this.trace = createTrace(label);
    this.parent = parent;
    this._cancelled = false;
  }

  get cancelled() {
    return (
      this._cancelled ||
      (this.parent !== null ? (this._cancelled = this.parent.cancelled) : false)
    );
  }

  cancel() {
    this._cancelled = true;
  }
}

module.exports = function createTask(cb, label) {
  return new Task(cb, label);
};
