//@flow
import React, { PureComponent } from 'react';
import type { Location, RouterHistory } from 'react-router-dom';

import LoginContainer from '../Login';

type Props = {
  isAuthenticated: boolean,
  location: Location,
  history: RouterHistory
};

class Home extends PureComponent<Props> {
  _renderAuthenticated() {
    return <h1>Authenticated</h1>;
  }
  _renderNotAuthenticated() {
    return <LoginContainer {...this.props} />;
  }
  render() {
    return this.props.isAuthenticated
      ? this._renderAuthenticated()
      : this._renderNotAuthenticated();
  }
}

export default Home;
