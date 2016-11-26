import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

import createTimeoutManager from './timeoutManager';
import createMountManager from './mountManager';

export function callFocusEventHandler(inst, focused, e) {
  let handler = inst.props[focused ? 'onFocus' : 'onBlur']
  handler && handler(e);
}

export default function createFocusManager(instance, {
  willHandle,
  didHandle,
  onChange,
  isDisabled = () => !!instance.props.disabled,
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
        if (focused !== lastFocused) {
          if (didHandle)
            didHandle.call(instance, focused, event)

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
      if (!isDisabled())
        handleFocus(false, event)
    },

    handleFocus(event) {
      if (!isDisabled())
        handleFocus(true, event)
    }
  };
}
