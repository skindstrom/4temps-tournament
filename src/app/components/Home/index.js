// @flow

import { connect } from 'react-redux';

import HomeComponent from './component';

function mapStateToProps({ user }: ReduxState) {
  return {
    isAuthenticated : user.id !== '',
  };
}

const HomeContainer =
  // $FlowFixMe
  connect(mapStateToProps)(HomeComponent);

export default HomeContainer;
