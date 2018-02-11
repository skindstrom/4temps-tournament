// @flow

import React, { Component } from 'react';
import { Form, FormInput, Message, Button } from 'semantic-ui-react';

type Props = {
  onSubmit: (name: string) => void,
  isValid: boolean,
  isLoading: boolean,
  createdSuccessfully: boolean
};

type State = {
  name: string
};

class CreateJudge extends Component<Props, State> {
  state = {
    name: ''
  };

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  _onSubmit = () => {
    this.props.onSubmit(this.state.name);
  };

  render() {
    const { isValid, isLoading, createdSuccessfully } = this.props;
    const { name } = this.state;
    return (
      <Form loading={isLoading} error={!isValid} success={createdSuccessfully}>
        {createdSuccessfully && <Message success content="Success!" />}
        <FormInput label="Name" value={name} onChange={this._onChangeName} />
        {!isValid && <Message error content="Name must not be empty" />}
        <Button onClick={this._onSubmit}>Add judge</Button>
      </Form>
    );
  }
}

export default CreateJudge;
