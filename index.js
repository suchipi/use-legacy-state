var React = require("react");
var useState = React.useState;
var useLayoutEffect = React.useLayoutEffect;
var useRef = React.useRef;
var assign = require("object.assign").getPolyfill();

module.exports = function useLegacyState(initialState = {}) {
  var pair = useState(initialState);
  var state = pair[0];
  var setStateObj = pair[1];

  var pendingPostUpdateCallbacks = useRef([]);
  useLayoutEffect(function() {
    if (pendingPostUpdateCallbacks.current.length > 0) {
      pendingPostUpdateCallbacks.current.forEach(function(
        pendingPostUpdateCallback
      ) {
        pendingPostUpdateCallback();
      });
      pendingPostUpdateCallbacks.current = [];
    }
  });

  function setState(partialObjOrCallback, maybeAfterCallback) {
    var newState = assign({}, state);
    var abortUpdate = false;
    if (
      typeof partialObjOrCallback === "object" &&
      partialObjOrCallback != null
    ) {
      assign(newState, partialObjOrCallback);
    } else if (typeof partialObjOrCallback === "function") {
      var result = partialObjOrCallback(state);
      if (result === null) {
        abortUpdate = true;
      } else {
        assign(newState, result);
      }
    } else {
      throw new Error(
        "Invalid argument passed to setState. Expected a function or object, but received: " +
          partialObjOrCallback
      );
    }

    if (abortUpdate) {
      return;
    }

    if (typeof maybeAfterCallback === "function") {
      pendingPostUpdateCallbacks.current.push(maybeAfterCallback);
    }
    setStateObj(newState);
  }

  return [state, setState];
};
