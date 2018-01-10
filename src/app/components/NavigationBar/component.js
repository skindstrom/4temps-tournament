// @flow
import React, { PureComponent } from 'react';
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

class NavigationBar extends PureComponent<Props> {

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
    const { activeName } = this.props;
    return (
      <Menu>
        <MenuItem as={Link} to='/' name='header' header>
          4 Temps Tournaments
        </MenuItem>
        <MenuItem
          name='home'
          as={Link}
          to='/'
          active={activeName === 'home'}
        >
          Home
        </MenuItem>
        <Dropdown item text='Tournament'>
          <DropdownMenu>
            <DropdownItem
              as={Link}
              to='/tournament/create'
              text='Create tournament'
              active={activeName === 'tournament/create'}
            />
            <DropdownItem
              as={Link}
              to='/tournament/edit'
              text='Edit tournaments'
              active={activeName === 'tournament/edit'}
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