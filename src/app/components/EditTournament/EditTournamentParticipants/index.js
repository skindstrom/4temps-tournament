// @flow
import React, { Component } from 'react';
import { Form, FormButton, FormRadio, FormGroup, FormInput } from
  'semantic-ui-react';

type Role = 'none' | 'leader' | 'follower' | 'leaderAndFollower';

type State = {
  name: string,
  role: Role,
}

class AddParticipants extends Component<{}, State> {
  state = {
    name: '',
    role: 'none'
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ name: event.target.value });


  _onChangeRadio =
    (event: SyntheticInputEvent<HTMLInputElement>,
      { value }: { value: Role }) =>
      this.setState({ role: value });


  render() {
    return (
      <Form>
        <FormInput
          label='Name'
          value={this.state.name}
          onChange={this._onChangeName}
        />
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
        <FormButton type='submit' onClick={() => alert('Submitted!')}>
          Add participant
        </FormButton>
      </Form>);
  }
}

export default AddParticipants;