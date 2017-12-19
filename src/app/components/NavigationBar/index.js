// @flow
import React, { Component } from 'react';
import { Button, Menu, MenuItem, MenuMenu } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';

type Props = {
  location: Location,
  history: RouterHistory
}

type State = {
  activeName: string
}

class NavigationBar extends Component<Props, State> {
  static _getActiveName = (location: string): string => {
    const matches = location.match(/\/(.+)\/?\??.*/);
    let activeName = 'home';
    if (matches) {
      activeName = matches[1];
    }
    return activeName;
  }

  state = {
    activeName: NavigationBar._getActiveName(this.props.location.pathname)
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeName: NavigationBar._getActiveName(nextProps.location.pathname)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activeName != this.state.activeName;
  }

  _navigate = (to: string) => {
    if (to != this.props.location.pathname) {
      this.props.history.push(to);
    }
  }

  render() {
    return (
      <Menu>
        <MenuItem
          name='home'
          active={this.state.activeName === 'home'}
          onClick={() => this._navigate('/')}
        >
          Home
        </MenuItem>
        <MenuItem
          name='create-tournament'
          active={this.state.activeName === 'create-tournament'}
          onClick={() => this._navigate('/create-tournament')}
        >
          Create Tournament
        </MenuItem>
        <MenuMenu position='right'>
          <MenuItem
            name='signup'
            onClick={() => this._navigate('/signup')}
          >
            <Button primary>
              Sign up
            </Button>
          </MenuItem>
          <MenuItem
            name='login'
            onClick={() => this._navigate('/login')}
          >
            <Button secondary>
              Log in
            </Button>
          </MenuItem>
        </MenuMenu>
      </Menu>);
  }
}

const NavigationBarWithRouter = withRouter(NavigationBar);

export default NavigationBarWithRouter;