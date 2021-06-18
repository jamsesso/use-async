var React = require('react');
var TestRenderer = require('react-test-renderer');
var useAsync = require('./index');

function doSomeWork() {
  return new Promise(
    function (resolve) {
      setTimeout(
        function () {
          resolve('Finished executing');
        },
        100
      );
    }
  );
}

var wasLoading = false;
var hasError = false;
var finalState = false;

function TestComponent(props) {
  var a = useAsync(doSomeWork);
  var wrapped = a[0];
  var state = a[1];

  React.useEffect(
    function () {
      // Invoke the wrapped function and make sure that the state changes properly over time.
      wrapped();
    },
    [a[0]]
  );

  if (state.loading) {
    wasLoading = true;
  }
  else if (state.error) {
    hasError = true;
    props.onComplete();
  }
  else {
    finalState = state.result;
    props.onComplete();
  }

  return null;
}

// Assertions.
var timeout;

TestRenderer.create(React.createElement(TestComponent, {
  onComplete: function () {
    if (!wasLoading) {
      console.error('State never transitioned to loading');
      process.exit(1);
    }
    else if (hasError) {
      console.error('Wrapper rejected, but wrapped function resolves');
      process.exit(1);
    }
    else if (finalState !== 'Finished executing') {
      console.error('Unexpected result, got: ', finalState);
      process.exit(1);
    }
    else {
      clearTimeout(timeout);
      console.log('Test passed!');
    }
  }
}));

timeout = setTimeout(
  function () {
    console.error('Test timed out');
    process.exit(1);
  },
  1000
);