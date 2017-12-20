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
import type { Tournament, TournamentType } from '../../../models/tournament';
import type { TournamentValidationSummary } from
  '../../../validators/validate-tournament';

type Props = {
  onSubmit: (tournament: Tournament) => void,
  validation: TournamentValidationSummary
}

type State = Tournament;

class CreateTournament extends Component<Props, State> {
  state = {
    name: '',
    date: moment(),
    type: 'none',
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
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <Container>
        <Form error={!this.props.validation.isValidTournament}>
          <FormInput
            label='Name'
            placeholder='4Temps World Championship'
            value={this.state.name}
            onChange={this._onChangeName}
          />
          {!this.props.validation.isValidName &&
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
          {!this.props.validation.isValidType &&
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