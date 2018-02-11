// @flow

import React, { PureComponent } from 'react';
import { Button, Form, FormInput, Header, Message } from 'semantic-ui-react';

import './styles.css';

type Props = {
  onSubmit: (key: string) => void,
  headerTitle: string,
  isValidAccessKey: boolean,
  isLoading: boolean,
  doesAccessKeyExist: boolean
};

type State = {
  accessKey: string
};

class Login extends PureComponent<Props, State> {
  static defaultProps = {
    headerTitle: 'Log in'
  };

  state = {
    accessKey: ''
  };

  _onAccessKeyChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ accessKey: event.target.value });
  };

  _onSubmit = () => {
    this.props.onSubmit(this.state.accessKey);
  };

  render() {
    return (
      <div styleName="center">
        <div styleName="width">
          <Header as="h1">{this.props.headerTitle}</Header>
          <Form
            loading={this.props.isLoading}
            error={
              !this.props.isValidAccessKey || !this.props.doesAccessKeyExist
            }
          >
            <FormInput
              label="Access Key"
              placeholder="exd618d5f1"
              value={this.state.accessKey}
              onChange={this._onAccessKeyChange}
            />
            {!this.props.isValidAccessKey && (
              <Message error content="Access keys are 10 characters long" />
            )}
            <Button type="submit" onClick={this._onSubmit}>
              Submit
            </Button>
            {!this.props.doesAccessKeyExist && (
              <Message error content="Access key does not exist!" />
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
