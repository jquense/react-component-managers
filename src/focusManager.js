import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

import createTimeoutManager from './timeoutManager';
import createMountManager from './mountManager';


export default function createFocusManager(instance, {
  willHandle,
  didHandle,
  onChange,
  fireEventHandlers = true,
}) {
  let lastFocused;
  let timeouts = createTimeoutManager(instance);
  let isMounted = createMountManager(instance);

  function callbacks(focused, e) {
    let handler = instance.props[focused ? 'onFocus' : 'onBlur']
    handler && handler(e);
  }

  function handleFocus(focused, event) {
    if (event && event.persist)
      event.persist()

    if (willHandle && willHandle(focused, event) === false)
      return

    timeouts.set('focus', () => {
      batchedUpdates(() => {
        if (didHandle)
          didHandle.call(instance, focused, event)

        if (focused !== lastFocused) {
          if (fireEventHandlers) {
            callbacks(focused, event);
          }

          // only fire a change when unmounted if its a blur
          if (isMounted() || !focused) {
            lastFocused = focused
            onChange && onChange(focused, event)
          }
        }
      })
    })
  }

  return {
    handleBlur(event) {
      handleFocus(false, event)
    },

    handleFocus(event) {
      handleFocus(true, event)
    }
  };
}
