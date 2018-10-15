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
import createAssistant from './create-assistant';
import notes from './notes';
import settleDraw from './settle-draw';

export default combineReducers({
  login,
  judgeLogin,
  signUp,
  createRound,
  createTournament,
  editTournament,
  createParticipant,
  createJudge,
  createAssistant,
  notes,
  settleDraw
});
