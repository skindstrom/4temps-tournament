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
  onClickLogout: () => Promise<void>
};

type State = {
  visible: boolean
};

class NavigationBar extends PureComponent<Props, State> {
  state = { visible: false };

  toggleSideBar = () => this.setState({ visible: !this.state.visible });

  _renderNotAuthenticated = () => {
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

  _renderAuthenticated = () => {
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

  _renderDesktopView = () => {
    const { activeItem } = this.props;
    return (
      <Menu secondary>
        <MenuItem as={Link} to="/" name="header" header disabled>
          4 Temps Tournaments
        </MenuItem>
        <Menu.Item
          as={Link}
          to="/tournament/create"
          active={activeItem === 'tournament/create'}
          onClick={this.toggleSideBar}
        >
          <Icon name="plus" />
          Create Tournament
        </Menu.Item>
        <Menu.Item
          as={Link}
          to="/tournament/edit"
          active={activeItem === 'tournament/edit'}
          onClick={this.toggleSideBar}
        >
          <Icon name="edit" />
          Edit Tournament
        </Menu.Item>
        {this.props.isAuthenticated
          ? this._renderAuthenticated()
          : this._renderNotAuthenticated()}
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
        <MenuMenu position="right">
          <Button icon="sidebar" onClick={this.toggleSideBar} />
          {this._renderSideBar()}
        </MenuMenu>
      </Menu>
    );
  };

  _renderSideBar = () => {
    const { visible } = this.state;

    const { activeItem } = this.props;
    return (
      <MenuMenu>
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

          <Menu.Item
            as={Link}
            to="/tournament/create"
            active={activeItem === 'tournament/create'}
            onClick={this.toggleSideBar}
          >
            <Icon name="plus" />
            Create Tournament
          </Menu.Item>

          <Menu.Item
            as={Link}
            to="/tournament/edit"
            active={activeItem === 'tournament/edit'}
            onClick={this.toggleSideBar}
          >
            <Icon name="edit" />
            Edit Tournament
          </Menu.Item>
          <div styleName='filler' />
          {this.props.isAuthenticated ? (
            <MenuMenu>
              <MenuItem onClick={() => {
                this.toggleSideBar();
                this.props.onClickLogout();
              }}
              >
                <h3>Log out</h3>
              </MenuItem>
            </MenuMenu>
          ) : (
            <MenuMenu>
              <MenuItem
                as={Link}
                to='/login'
                onClick={this.toggleSideBar}
              >
                <h3>Log in</h3>
              </MenuItem>
              <MenuItem
                as={Link}
                to='/signup'
                onClick={this.toggleSideBar}
              >
                <h3>Sign up</h3>
              </MenuItem>
            </MenuMenu>)}
          <div styleName='bottom-filler' />
        </Sidebar>
      </MenuMenu>
    );
  };

  render() {
    /* Perform conditional rendering with CSS to not mess up the re-hydration*/
    return (
      <span>
        <span styleName='navbar'>
          {this._renderDesktopView()}
        </span>
        <span styleName='sidebar'>
          {this._renderTabletView()}
        </span>
      </span>
    );
  }
}

export default NavigationBar;
