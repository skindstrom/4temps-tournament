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
  activeName: string
}

class NavigationBarContainer extends Component<Props, State> {
  static _getActivePath = (location: string): string => {
    const matches = location.match(/\/(.+)\/?\??.*/);
    let activeName = 'home';
    if (matches) {
      activeName = matches[1];
    }
    return activeName;
  }

  state = {
    activeName:
      NavigationBarContainer._getActivePath(this.props.location.pathname)
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeName:
        NavigationBarContainer._getActivePath(nextProps.location.pathname)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activeName != this.state.activeName
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
        activeName={this.state.activeName}
        leftMenu={[
          { name: 'home', path: '', text: 'Home' },
          {
            name: 'create-tournament',
            path: 'create-tournament',
            text: 'Create Tournament'
          }
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