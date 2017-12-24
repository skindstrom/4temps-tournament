// @flow
import React, { Component } from 'react';
import {
  Button, Dropdown, DropdownMenu, DropdownItem,
  Menu, MenuItem, MenuMenu
} from 'semantic-ui-react';

type Props = {
  activeName: string,
  onClick: (path: string) => void,
  isAuthenticated: boolean,
  onClickLogout: () => Promise<void>,
}

class NavigationBar extends Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.activeName != this.props.activeName
      || nextProps.isAuthenticated != this.props.isAuthenticated;
  }

  _renderNotAuthenticated = () => {
    return (
      <MenuMenu position='right'>
        <MenuItem
          name='signup'
          onClick={() => this.props.onClick('/signup')}
        >
          <Button primary>
            Sign up
          </Button>
        </MenuItem>
        <MenuItem
          name='login'
          onClick={() => this.props.onClick('/login')}
        >
          <Button secondary>
            Log in
          </Button>
        </MenuItem>
      </MenuMenu>);
  }

  _renderAuthenticated = () => {
    return (
      <MenuItem
        position='right'
        name='logout'
        onClick={() => this.props.onClickLogout()}
      >
        <Button secondary>
          Log out
        </Button>
      </MenuItem>);
  };

  render() {
    return (
      <Menu>
        <MenuItem name='header' header onClick={() => this.props.onClick('/')}>
          4Temps Tournaments
        </MenuItem>
        <MenuItem
          name='home'
          active={this.props.activeName === 'home'}
          onClick={() => this.props.onClick('/')}
        >
        Home
        </MenuItem>
        <Dropdown item text='Tournament'>
          <DropdownMenu>
            <DropdownItem
              text='Create tournament'
              active={this.props.activeName === 'create-tournament'}
              onClick={() => this.props.onClick('/create-tournament')}
            />
            <DropdownItem
              text='Modify tournaments'
              active={this.props.activeName === 'modify-tournament'}
              onClick={() => this.props.onClick('/modify-tournament')}
            />
          </DropdownMenu>
        </Dropdown>
        {this.props.isAuthenticated ?
          this._renderAuthenticated() :
          this._renderNotAuthenticated()}
      </Menu>);
  }
}

export default NavigationBar;