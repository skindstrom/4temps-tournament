// @flow
import React, { PureComponent } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuMenu,
  Icon,
  Sidebar
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import './styles.css';

type Props = {
  activeItem: string,
  isAuthenticated: boolean,
  role: string,
  onClickLogout: () => Promise<void>
};

type State = {
  visible: boolean
};

class NavigationBar extends PureComponent<Props, State> {
  state = { visible: false };

  toggleSideBar = () => this.setState({ visible: !this.state.visible });

  _renderSignUpLogIn = () => {
    return (
      <MenuMenu position="right">
        <MenuItem name="signup">
          <Button primary as={Link} to="/signup">
            Sign up
          </Button>
        </MenuItem>
        <MenuItem name="login">
          <Button secondary as={Link} to="/login">
            Log in
          </Button>
        </MenuItem>
      </MenuMenu>
    );
  };

  _renderLogOut = () => {
    return (
      <MenuItem
        position="right"
        name="logout"
        onClick={() => this.props.onClickLogout()}
      >
        <Button secondary>Log out </Button>
      </MenuItem>
    );
  };

  _renderForRole = () => {
    if (this.props.isAuthenticated) {
      if (this.props.role == 'admin') {
        return this._renderAuthenticatedAdmin();
      } else if (this.props.role == 'judge') {
        return this._renderAuthenticatedJudge();
      } else {
        //Undefined role, for now do nothing
      }
    } else {
      // Not authed, for now do nothing
    }
  };

  _renderAuthenticatedAdmin = () => {
    const { activeItem } = this.props;
    return [
      <Menu.Item
        key="create"
        as={Link}
        to="/tournament/create"
        active={activeItem === 'tournament/create'}
        onClick={this.toggleSideBar}
      >
        <Icon name="plus" />
        Create Tournament
      </Menu.Item>,
      <Menu.Item
        as={Link}
        key="edit"
        to="/tournament/edit"
        active={activeItem === 'tournament/edit'}
        onClick={this.toggleSideBar}
      >
        <Icon name="edit" />
        Edit Tournament
      </Menu.Item>
    ];
  };

  _renderAuthenticatedJudge = () => {
    // Judge specific navigation goes here
    // For now we dont want the judge to be able to navigate anywhere
    // Therefore, return empty menu item
    return <Menu.Item />;
  };

  _renderDesktopView = () => {
    return (
      <Menu secondary>
        <MenuItem as={Link} to="/" name="header" header>
          4 Temps Tournaments
        </MenuItem>
        {this._renderForRole()}
        {this.props.isAuthenticated
          ? this._renderLogOut()
          : this._renderSignUpLogIn()}
      </Menu>
    );
  };

  _renderTabletView = () => {
    // Collapse navbar into a dropdown
    return (
      <Menu secondary>
        <MenuItem as={Link} to="/" name="header" header>
          4 Temps Tournaments
        </MenuItem>
        <Menu.Item position="right">
          <Button icon="sidebar" onClick={this.toggleSideBar} />
          {this._renderSideBar()}
        </Menu.Item>
      </Menu>
    );
  };

  _renderSideBar = () => {
    const { visible } = this.state;

    const { activeItem } = this.props;
    return (
      <Menu secondary>
        <Sidebar
          as={Menu}
          animation="push"
          width="thin"
          direction="right"
          visible={visible}
          icon="labeled"
          vertical
          inverted
        >
          <Menu.Item
            as={Link}
            to="/"
            active={activeItem === '/'}
            onClick={this.toggleSideBar}
          >
            <Icon name="home" />
            Home
          </Menu.Item>

          {this._renderForRole()}

          <div styleName="filler" />

          {this.props.isAuthenticated ? (
            <Menu.Item
              onClick={() => {
                this.toggleSideBar();
                this.props.onClickLogout();
              }}
            >
              <h3>Log out</h3>
            </Menu.Item>
          ) : (
            <div position="bottom">
              <Menu.Item as={Link} to="/login" onClick={this.toggleSideBar}>
                <h3>Log in</h3>
              </Menu.Item>
              <Menu.Item as={Link} to="/signup" onClick={this.toggleSideBar}>
                <h3>Sign up</h3>
              </Menu.Item>
            </div>
          )}
          <div styleName="bottom-filler" />
        </Sidebar>
      </Menu>
    );
  };

  render() {
    /* Perform conditional rendering with CSS to not mess up the re-hydration*/
    return (
      <span>
        <span styleName="navbar">{this._renderDesktopView()}</span>
        <span styleName="sidebar">{this._renderTabletView()}</span>
      </span>
    );
  }
}

export default NavigationBar;
