import React, { PureComponent } from 'react';


type Props = {
  isAuthenticated: boolean,
}

class Home extends PureComponent<Props> {
  _renderAuthenticated() {
    return (
      <h1>Authenticated</h1>
    )
  }
  _renderNotAuthenticated() {
    return (
      <h1>Not authenticated</h1>
    )
  }
  render () {
    return (
        this.props.isAuthenticated ?
        this._renderAuthenticated() :
        this._renderNotAuthenticated()
    );
  }
}

export default Home;
