// @flow
import React, { Component } from 'react';

import Router from '../Router';
import NavigationBar from '../NavigationBar';

type Props = {
  isAuthenticated: () => boolean
}

type State = {
  isAuthenticated: boolean
}

class App extends Component<Props, State> {
  state = {
    isAuthenticated: this.props.isAuthenticated()
  }

  _updatedAuthenticationState = () => {
    this.setState({
      isAuthenticated: this.props.isAuthenticated()
    });
  }

  render() {
    return (
      <div>
        <NavigationBar
          isAuthenticated={this.state.isAuthenticated}
          updatedAuthenticationState={this._updatedAuthenticationState}
        />
        <Router
          isAuthenticated={this.state.isAuthenticated}
          updatedAuthenticationState={this._updatedAuthenticationState}
        />
      </div>
    );
  }
}

export default App;