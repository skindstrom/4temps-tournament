// @flow
import React, { PureComponent } from 'react';

import AdminLogin from './AdminLogin';
import AccessKeyLogin from './AccessKeyLogin';

class Login extends PureComponent<{}> {
  static credentialHeader = 'Credential Login';
  static accessKeyHeader = 'Access Key Login';
  render () {
    return (
      <div>
        <AccessKeyLogin headerTitle={Login.accessKeyHeader} {...this.props} />
        <AdminLogin headerTitle={Login.credentialHeader} {...this.props} />
      </div>
    );
  }
}
export default Login;
