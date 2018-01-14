// @flow

import { combineReducers } from 'redux';
import login from './login';
import signUp from './signup';
import createTournament from './create-tournament';
import editTournament from './edit-tournament';
import createParticipant from './create-participant';

export default combineReducers({
  login,
  signUp,
  createTournament,
  editTournament,
  createParticipant,
});