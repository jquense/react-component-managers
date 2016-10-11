import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

import createTimeoutManager from './timeoutManager';
import createMountManager from './mountManager';

export default function createFocusManager(instance, {
  willHandle,
  didHandle,
  onChange = (focused, e) => {
    let handler = instance.props[focused ? 'onFocus' : 'onBlur']
    handler && handler(e);
  },
}) {
  let lastFocused;
  let timeouts = createTimeoutManager(instance);
  let isMounted = createMountManager(instance);

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
          // only fire a change when unmounted if its a blur
          if (isMounted() || !focused) {
            lastFocused = focused
            onChange(focused, event)
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
