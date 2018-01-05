// @flow
import React, { Component } from 'react';
import { Form, FormButton, FormRadio, FormGroup, FormInput, Message } from
  'semantic-ui-react';

import { createParticipant } from '../../../api/participant';

type Role = 'none' | 'leader' | 'follower' | 'leaderAndFollower';

type Props = {
  tournamentId: string
}
type State = {
  name: string,
  role: Role,

  isValidParticipant: boolean,
  isValidName: boolean,
  isValidRole: boolean
}

class AddParticipants extends Component<Props, State> {
  state = {
    name: '',
    role: 'none',

    isValidParticipant: true,
    isValidName: true,
    isValidRole: true
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ name: event.target.value });


  _onChangeRadio =
    (event: SyntheticInputEvent<HTMLInputElement>,
      { value }: { value: Role }) =>
      this.setState({ role: value });

  _onSubmit = async () => {
    const { success, result } = await createParticipant(this.props.tournamentId,
      { name: this.state.name, role: this.state.role });
    if (success) {
      this.setState({ isValidParticipant: true });
    } else if (result != null) {
      this.setState({ ...this.state, ...result });
    }
  }


  render() {
    const { isValidParticipant, isValidName, isValidRole } = this.state;
    return (
      <Form error={!isValidParticipant}>
        <FormInput
          label='Name'
          value={this.state.name}
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
            checked={this.state.role === 'leader'}
          />
          <FormRadio
            label='Follower'
            value='follower'
            onChange={this._onChangeRadio}
            checked={this.state.role === 'follower'}
          />
          <FormRadio
            label='Both leader and follower'
            value='leaderAndFollower'
            onChange={this._onChangeRadio}
            checked={this.state.role === 'leaderAndFollower'}
          />
        </FormGroup>
        {!isValidRole &&  <Message error content='Must select a role' />}
        <FormButton type='submit' onClick={this._onSubmit}>
          Add participant
        </FormButton>
      </Form>);
  }
}

export default AddParticipants;