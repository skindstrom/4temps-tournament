//@flow
import React, { Component } from 'react';
import {
  Container,Button, Form, FormField,
  FormInput, FormRadio, FormGroup
} from 'semantic-ui-react';
import type Moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';

type TournamentType = 'jj' | 'classic';
type Props = {}

type State = {
  name: string,
  date: ?Moment,
  type: ?TournamentType
}

class CreateTournament extends Component<Props, State> {
  state = {
    name: '',
    date: null,
    type: null,
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
    alert('Submitted!');
  };

  render() {
    return (
      <Container>
        <Form>
          <FormInput
            label='Name'
            placeholder='4Temps World Championship'
            value={this.state.name}
            onChange={this._onChangeName}
          />
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
          <Button type='submit' onClick={this._onSubmit}>
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default CreateTournament;