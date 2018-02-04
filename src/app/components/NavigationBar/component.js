// @flow
import React, { PureComponent } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuMenu,
  Responsive,
  Segment,
  Icon,
  Sidebar
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
        <MenuItem as={Link} to="/" name="header" header>
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
        </Sidebar>
      </MenuMenu>
    );
  };

  render() {
    return (
      <Segment.Group>
        <Responsive minWidth={769}>{this._renderDesktopView()}</Responsive>
        <Responsive maxWidth={768}>{this._renderTabletView()}</Responsive>
      </Segment.Group>
    );
  }
}

export default NavigationBar;
