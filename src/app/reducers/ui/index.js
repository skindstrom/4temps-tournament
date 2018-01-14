// @flow

import { combineReducers } from 'redux';
import login from './login';
import signUp from './signup';

export default combineReducers({ login, signUp });