// @flow

import { combineReducers } from 'redux';
import login from './login';
import signUp from './signup';
import createTournament from './create-tournament';
import editTournament from './edit-tournament';
import createParticipant from './create-participant';
import createRound from './create-round';
import createJudge from './create-judge';
import judgeLogin from './judge-login';

export default combineReducers({
  login,
  judgeLogin,
  signUp,
  createRound,
  createTournament,
  editTournament,
  createParticipant,
  createJudge
});
