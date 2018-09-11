//@flow
import React, { PureComponent } from 'react';
import type { Location, RouterHistory } from 'react-router-dom';

import LoginContainer from '../Login';
import Judge from '../Judge';
import EditTournamentList from '../EditTournamentList';
import Assistant from '../Assistant';

type Props = {
  isAuthenticated: boolean,
  role: string,
  location: Location,
  history: RouterHistory
};

class Home extends PureComponent<Props> {
  _renderForRole() {
    if (this.props.role == 'admin') {
      return <EditTournamentList history={this.props.history} />;
    } else if (this.props.role == 'judge') {
      return <Judge />;
    } else if (this.props.role == 'assistant') {
      return <Assistant />;
    } else {
      return <LoginContainer {...this.props} />;
    }
  }

  render() {
    return this._renderForRole();
  }
}

export default Home;
