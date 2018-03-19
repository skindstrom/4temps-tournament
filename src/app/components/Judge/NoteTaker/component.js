// @flow

import React from 'react';

import PairNoteTaker from './PairNoteTaker';
import SeparateNoteTaker from './SeparateNoteTaker';

export type StateProps = {
  isClassic: boolean,
  isLastRound: boolean
};

function NoteTaker({ isLastRound, isClassic }: StateProps) {
  return isLastRound || isClassic ? <PairNoteTaker /> : <SeparateNoteTaker />;
}

export default NoteTaker;
