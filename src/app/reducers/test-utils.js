// @flow

import { LIFECYCLE, KEY } from 'redux-pack';

type Lifecycle = typeof LIFECYCLE;

// From https://github.com/lelandrichardson/redux-pack
// this utility method will make an action that redux pack understands
function makePackAction(lifecycle: Lifecycle, type: string,
  payload: ?mixed = null) {
  return {
    type,
    payload,
    meta: {
      [KEY.LIFECYCLE]: lifecycle,
    },
  };
}

export default makePackAction;