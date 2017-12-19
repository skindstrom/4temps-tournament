// @flow
import React, { Component } from 'react';
import { Button, Menu, MenuItem, MenuMenu } from 'semantic-ui-react';

type Item = {
  name: string,
  path: string,
  text: string
}

type Props = {
  activeName: string,
  leftMenu: Array<Item>,
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

  _renderLeftItem = (item: Item) => {
    return (
      <MenuItem
        key={item.path}
        name={item.name}
        active={this.props.activeName === item.name}
        onClick={() => this.props.onClick(`/${item.path}`)}
      >
        {item.text}
      </MenuItem>);
  }

  render() {
    return (
      <Menu>
        <MenuItem name='header' header onClick={() => this.props.onClick('/')}>
          4Temps Tournaments
        </MenuItem>
        {this.props.leftMenu.map(item => this._renderLeftItem(item))}
        {this.props.isAuthenticated ?
          this._renderAuthenticated() :
          this._renderNotAuthenticated()}
      </Menu>);
  }
}

export default NavigationBar;