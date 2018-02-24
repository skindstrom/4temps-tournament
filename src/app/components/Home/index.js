// @flow

import { connect } from 'react-redux';

import HomeComponent from './component';

function mapStateToProps({ user }: ReduxState) {
  return {
    isAuthenticated: user.id !== '',
    role: user.role
  };
}

const HomeContainer =
  // $FlowFixMe
  connect(mapStateToProps)(HomeComponent);

export default HomeContainer;
