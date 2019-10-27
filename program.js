const requestAnimationFrame = require("./queues/animate").animate;
const setTimeout = require("./queues/timeout").setTimeout;
const resolve = require("./queues/promise").resolve;

/*
// use this resolve function to run the same program
// in the browser
function resolve(cb) {
  Promise.resolve().then(cb);
}
*/

let actions = [];

const state = {
  get path() {
    return actions.join(", ");
  },
  toString() {
    return `${state.path}`;
  }
};

function doLotsOfAsync() {
  requestAnimationFrame(() => {
    actions.push("9");
    resolve(() => {
      actions.push("10");
    });
    requestAnimationFrame(() => {
      actions.push("15");
      resolve(() => {
        actions.push("16");
        throw new Error("Where am I?");
      });
    });
  });

  requestAnimationFrame(() => {
    actions.push("11");
    resolve(() => {
      actions.push("12");
    });
  });

  setTimeout(() => {
    actions.push("7");
    resolve(() => {
      actions.push("8");
    });
  });

  setTimeout(() => {
    actions.push("13");
    resolve(() => {
      actions.push("14");
    });
  }, 20);

  resolve(() => {
    actions.push("1");
    resolve(() => {
      actions.push("3");
      resolve(() => {
        actions.push("6");
      });
    });
    resolve(() => {
      actions.push("4");
    });
  });

  resolve(() => {
    actions.push("2");
    resolve(() => {
      actions.push("5");
    });
  });
}

function forceRender() {
  requestAnimationFrame(forceRender);
}

module.exports = function program() {
  doLotsOfAsync();

  forceRender();

  return state;
};
