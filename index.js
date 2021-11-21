"use strict";
const React = require('react');

function useAsync(f, options) {
  if (typeof options !== 'object') {
    options = {
      initialState: {
        loading: true
      }
    };
  }
  var reducer = React.useReducer(function (prevState, action) {
    switch (action.type) {
      case 'LOADING':
        return { loading: true, error: false, result: null };
      case 'ERROR':
        return { loading: false, error: action.error, result: null };
      case 'SUCCESS':
        return { loading: false, error: false, result: action.payload };
      default:
        return prevState;
    }
  }, {
    loading: options.initialState.loading,
    error: null,
    result: null
  });

  var state = reducer[0];
  var dispatch = reducer[1];
  
  var wrapped = React.useCallback(
    function () {
      dispatch({ type: 'LOADING' });

      return f.apply(void 0, arguments)
        .then(
          function (payload) {
            dispatch({ type: 'SUCCESS', payload: payload });
            return Promise.resolve(payload);
          }
        ).catch(
          function (error) {
            dispatch({ type: 'ERROR', error: error });
          }
        );
    }, 
    [dispatch, f]
  );

  return React.useMemo(
    function () {
      return [wrapped, state];
    }, 
    [wrapped, state]
  );
}

module.exports = useAsync;
