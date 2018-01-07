// @flow
import React, { Component } from 'react';
import { Form, FormButton, FormRadio, FormGroup, FormInput, Message } from
  'semantic-ui-react';

import type { Role } from '../../../../../models/participant';

type Props = {
  isLoading: boolean,

  addedSuccessfully: boolean,

  isValidParticipant: boolean,
  isValidName: boolean,
  isValidRole: boolean,

  onSubmit: (state: State) => Promise<void>
}

export type State = {
  name: string,
  role: Role
};

class AddParticipant extends Component<Props, State> {
  state = {
    name: '',
    role: 'none',
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ name: event.target.value });

  _onChangeRadio =
    (event: SyntheticInputEvent<HTMLInputElement>,
      { value }: { value: Role }) =>
      this.setState({ role: value });

  _onSubmit = async () => {
    this.props.onSubmit(this.state);
  }

  render() {
    const { isLoading, isValidParticipant, isValidName, isValidRole } =
      this.props;
    const { name, role } = this.state;
    return (
      <Form error={!isValidParticipant} loading={isLoading}>
        {this.props.addedSuccessfully &&
          <Message positive content='Success!' />}
        <FormInput
          label='Name'
          value={name}
          onChange={this._onChangeName}
        />
        {!isValidName &&  <Message error content='Invalid name' />}
        <FormGroup id='role-radio' inline>
          <label htmlFor='role-radio'>
            Role
          </label>
          <FormRadio
            label='Leader'
            value='leader'
            onChange={this._onChangeRadio}
            checked={role === 'leader'}
          />
          <FormRadio
            label='Follower'
            value='follower'
            onChange={this._onChangeRadio}
            checked={role === 'follower'}
          />
          <FormRadio
            label='Both leader and follower'
            value='leaderAndFollower'
            onChange={this._onChangeRadio}
            checked={role === 'leaderAndFollower'}
          />
        </FormGroup>
        {!isValidRole &&  <Message error content='Must select a role' />}
        <FormButton type='submit' onClick={this._onSubmit}>
          Add participant
        </FormButton>
      </Form>);
  }
}

export default AddParticipant;