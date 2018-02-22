// @flow

import React from 'react';

import PairNoteTaker from './PairNoteTaker';
import SeparateNoteTaker from './SeparateNoteTaker';

export type StateProps = {
  isLastRound: boolean
};

function NoteTaker({ isLastRound }: StateProps) {
  return isLastRound ? <PairNoteTaker /> : <SeparateNoteTaker />;
}

export default NoteTaker;
