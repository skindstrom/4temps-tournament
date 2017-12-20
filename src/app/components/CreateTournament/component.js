//@flow
import React, { Component } from 'react';
import {
  Container,Button, Form, FormField,
  FormInput, FormRadio, FormGroup, Message
} from 'semantic-ui-react';
import moment from 'moment';
import type Moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export type TournamentType = 'none' | 'jj' | 'classic';

type Props = {
  onSubmit: (name: string, date: Moment, type: TournamentType) => void,
  isValidInput: boolean,
  isValidName: boolean,
  isValidType: boolean
}

type State = {
  name: string,
  date: Moment,
  type: TournamentType
}

class CreateTournament extends Component<Props, State> {
  state = {
    name: '',
    date: moment(),
    type: 'none',
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const isStateDifferent = this.state.name !== nextState.name
      || !nextState.date.isSame(this.state.date)
      || this.state.type !== nextState.type;
    const isPropsDifferent = this.props.isValidInput !== nextProps.isValidInput
      || this.props.isValidName !== nextProps.isValidName
      || this.props.isValidType !== nextProps.isValidType;

    return isStateDifferent || isPropsDifferent;
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  _onChangDate = (date: Moment) => {
    this.setState({ date });
  };

  _onChangeRadio =
    (event: SyntheticInputEvent<HTMLInputElement>,
      { value }: { value: TournamentType }) => {
      this.setState({ type: value });
    };

  _onSubmit = () => {
    const { name, date, type } = this.state;
    this.props.onSubmit(name, date, type);
  };

  render() {
    return (
      <Container>
        <Form error={!this.props.isValidInput}>
          <FormInput
            label='Name'
            placeholder='4Temps World Championship'
            value={this.state.name}
            onChange={this._onChangeName}
          />
          {!this.props.isValidName &&
            <Message error content='Invalid name' />}
          <div className='field'>
            <label htmlFor='date'>Date
              <DatePicker
                id='date'
                allowSameDay
                selected={this.state.date}
                onChange={this._onChangDate}
              />
            </label>
          </div>
          <FormGroup inline>
            <FormField label='Tournament Type' />
            <FormRadio
              label='Classic'
              value='classic'
              onChange={this._onChangeRadio}
              checked={this.state.type === 'classic'}
            />
            <FormRadio
              label="Jack n' Jill"
              value='jj'
              onChange={this._onChangeRadio}
              checked={this.state.type === 'jj'}
            />
          </FormGroup>
          {!this.props.isValidType &&
            <Message error content='Must select a type' />}
          <Button type='submit' onClick={this._onSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default CreateTournament;