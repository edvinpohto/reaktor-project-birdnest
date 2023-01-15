import React, { useState, useEffect, useRef } from 'react';

// This custom hook is created by Dan Abramov https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// The hook sets up an interval and clears it after unmounting.
// Used due to the importance of clearing the interval if using it.
export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}