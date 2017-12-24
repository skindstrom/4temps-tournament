// @flow
import React, { Component } from 'react';
import {
  Button, Dropdown, DropdownMenu, DropdownItem,
  Menu, MenuItem, MenuMenu
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

type Props = {
  activeName: string,
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
        >
          <Button primary as={Link} to='/signup'>
            Sign up
          </Button>
        </MenuItem>
        <MenuItem
          name='login'
        >
          <Button secondary as={Link} to='/login'>
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
        <MenuItem as={Link} to='/' name='header' header>
          4Temps Tournaments
        </MenuItem>
        <MenuItem
          name='home'
          as={Link}
          to='/'
          active={this.props.activeName === 'home'}
        >
          Home
        </MenuItem>
        <Dropdown item text='Tournament'>
          <DropdownMenu>
            <DropdownItem
              as={Link}
              to='/create-tournament'
              text='Create tournament'
              active={this.props.activeName === 'create-tournament'}
            />
            <DropdownItem
              as={Link}
              to='/modify-tournament'
              text='Modify tournaments'
              active={this.props.activeName === 'modify-tournament'}
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