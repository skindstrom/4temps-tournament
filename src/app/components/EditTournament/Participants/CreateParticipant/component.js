// @flow
import React, { Component } from 'react';
import {
  Form,
  FormButton,
  FormRadio,
  FormGroup,
  FormInput,
  Message
} from 'semantic-ui-react';
import type { ParticipantValidationSummary } from '../../../../../validators/validate-participant';

type Props = {
  isLoading: boolean,

  createdSuccessfully: boolean,

  validation: ParticipantValidationSummary,
  onSubmit: (state: State) => void
};

export type State = {
  name: string,
  role: ParticipantRole
};

class CreateParticipant extends Component<Props, State> {
  state = {
    name: '',
    role: 'none'
  };

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({ name: event.target.value });

  _onChangeRadio = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: ParticipantRole }
  ) => this.setState({ role: value });

  _onSubmit = async () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { isLoading, validation } = this.props;
    const { isValidParticipant, isValidName, isValidRole } = validation;
    const { name, role } = this.state;
    return (
      <Form error={!isValidParticipant} loading={isLoading}>
        {this.props.createdSuccessfully && (
          <Message positive content="Success!" />
        )}
        <FormInput label="Name" value={name} onChange={this._onChangeName} />
        {!isValidName && <Message error content="Invalid name" />}
        <FormGroup id="role-radio" inline>
          <label htmlFor="role-radio">Role</label>
          <FormRadio
            label="Leader"
            value="leader"
            onChange={this._onChangeRadio}
            checked={role === 'leader'}
          />
          <FormRadio
            label="Follower"
            value="follower"
            onChange={this._onChangeRadio}
            checked={role === 'follower'}
          />
          <FormRadio
            label="Both leader and follower"
            value="leaderAndFollower"
            onChange={this._onChangeRadio}
            checked={role === 'leaderAndFollower'}
          />
        </FormGroup>
        {!isValidRole && <Message error content="Must select a role" />}
        <FormButton type="submit" onClick={this._onSubmit}>
          Add participant
        </FormButton>
      </Form>
    );
  }
}

export default CreateParticipant;
