import React, { PureComponent } from 'react';

import AdminLogin from './AdminLogin';
import AccessKeyLogin from './AccessKeyLogin';

class Login extends PureComponent<{}> {
  render () {
    return (
        <div>
          <AccessKeyLogin {...this.props}/>
          <AdminLogin {...this.props}/>
        </div>
    );
  }
}
export default Login;
