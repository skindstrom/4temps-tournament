import React, { PureComponent } from 'react';

import AdminLogin from './AdminLogin';

class Login extends PureComponent<{}> {
  render () {
    return (
        <AdminLogin {...this.props}/>
    );
  }
}
export default Login;
