// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import { logoutUser } from '../../api/user';

import NavigationBar from './component';

type Props = {
  location: Location,
  history: RouterHistory,
  isAuthenticated: boolean,
  updatedAuthenticationState: () => void
}

type State = {
  activePath: string
}

class NavigationBarContainer extends Component<Props, State> {
  static _getActivePath = (location: string): string => {
    const matches = location.match(/\/(.+)\/?\??.*/);
    let activePath = 'home';
    if (matches) {
      activePath = matches[1];
    }
    return activePath;
  }

  state = {
    activePath:
      NavigationBarContainer._getActivePath(this.props.location.pathname)
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      activePath:
        NavigationBarContainer._getActivePath(nextProps.location.pathname)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activePath != this.state.activePath
      || nextProps.isAuthenticated != this.props.isAuthenticated;
  }

  _navigate = (to: string) => {
    if (to != this.props.location.pathname) {
      this.props.history.push(to);
    }
  }

  _logout = async () => {
    if (await logoutUser()) {
      window.isAuthenticated = false;
      this.props.updatedAuthenticationState();
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <NavigationBar
        activePath={this.state.activePath}
        leftMenu={[
          { path: 'home', text: 'Home' },
          { path: 'create-tournament', text: 'Create Tournament' }
        ]}
        isAuthenticated={this.props.isAuthenticated}
        onClick={this._navigate}
        onClickLogout={this._logout}
      />
    );
  }
}

const NavigationBarWithRouter = withRouter(NavigationBarContainer);

export default NavigationBarWithRouter;