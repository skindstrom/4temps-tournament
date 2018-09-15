// @flow

import React, { Component } from 'react';
import {
  Form,
  FormInput,
  FormGroup,
  FormRadio,
  Message,
  Button
} from 'semantic-ui-react';

type OnSubmitParams = { name: string, type: JudgeType };

type Props = {
  onSubmit: OnSubmitParams => void,
  isValid: boolean,
  isLoading: boolean,
  createdSuccessfully: boolean
};

type State = OnSubmitParams;

class CreateJudge extends Component<Props, State> {
  state = {
    name: '',
    type: 'normal'
  };

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  _onChangeJugeType = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: JudgeType }
  ) => {
    this.setState({ type: value });
  };

  _onSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    const { isValid, isLoading, createdSuccessfully } = this.props;
    const { name } = this.state;
    return (
      <Form loading={isLoading} error={!isValid} success={createdSuccessfully}>
        {createdSuccessfully && <Message success content="Success!" />}
        <FormInput label="Name" value={name} onChange={this._onChangeName} />
        {!isValid && <Message error content="Name must not be empty" />}
        <FormGroup>
          <FormRadio
            label="Normal"
            value="normal"
            onChange={this._onChangeJugeType}
            checked={this.state.type === 'normal'}
          />
          <FormRadio
            label="Sanctioner"
            value="sanctioner"
            onChange={this._onChangeJugeType}
            checked={this.state.type === 'sanctioner'}
          />
        </FormGroup>
        <Button onClick={this._onSubmit}>Add judge</Button>
      </Form>
    );
  }
}

export default CreateJudge;
