const requestAnimationFrame = require("./shell/queues/animate").animate;
const setTimeout = require("./shell/queues/timeout").setTimeout;
const resolve = require("./shell/queues/promise").resolve;

/*
// use this resolve function to run the same program
// in the browser
function resolve(cb) {
  Promise.resolve().then(cb);
}
*/

let actions = [];
function log(str) {
  actions.push(str);
  console.log(str);
}

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
    log("9");
    resolve(() => {
      log("10");
    });
    requestAnimationFrame(() => {
      log("15");
      resolve(() => {
        log("16");
        throw new Error("Where am I?");
      });
    });
  });

  requestAnimationFrame(() => {
    log("11");
    resolve(() => {
      log("12");
    });
  });

  setTimeout(() => {
    log("7");
    resolve(() => {
      log("8");
    });
  });

  setTimeout(() => {
    log("13");
    resolve(() => {
      log("14");
    });
  }, 20);

  resolve(() => {
    log("1");
    resolve(() => {
      log("3");
      resolve(() => {
        log("6");
      });
    });
    resolve(() => {
      log("4");
    });
  });

  resolve(() => {
    log("2");
    resolve(() => {
      log("5");
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
