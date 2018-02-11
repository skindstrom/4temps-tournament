// @flow
import React, { Component } from 'react';
import {
  Container,
  Form,
  FormButton,
  FormInput,
  Message
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import type Moment from 'moment';
import moment from 'moment';
import type { Tournament } from '../../../../models/tournament';

type Props = {
  tournament: Tournament,

  isValidName: boolean,
  isValidDate: boolean,

  onSubmit: (tournament: Tournament) => Promise<void>
};

type State = {
  name: string,
  date: Moment
};

class EditTournamentGeneral extends Component<Props, State> {
  state = {
    name: this.props.tournament ? this.props.tournament.name : '',
    date: this.props.tournament ? this.props.tournament.date : moment()
  };

  componentWillReceiveProps({ tournament }: Props) {
    const { name, date } = tournament;
    if (
      !this.props.tournament ||
      (this.props.tournament.name !== name ||
        this.props.tournament.date !== date)
    ) {
      this.setState({ name, date });
    }
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  _onChangeDate = (date: ?Moment) => {
    if (date != null) {
      this.setState({ date });
    }
  };

  _onSubmit = () => {
    const { name, date } = this.state;
    this.props.onSubmit({ ...this.props.tournament, name, date });
  };

  render() {
    return (
      <Container>
        <Form error={!this.props.isValidName || !this.props.isValidDate}>
          <FormInput
            label="Name"
            placeholder="4Temps World Championship"
            value={this.state.name}
            onChange={this._onChangeName}
          />
          {!this.props.isValidName && <Message error content="Invalid name" />}
          <FormInput
            label="Date"
            control={DatePicker}
            allowSameDay
            selected={this.state.date}
            onChange={this._onChangeDate}
          />
          {!this.props.isValidDate && <Message error content="Invalid date" />}
          <FormButton onClick={this._onSubmit}>Submit</FormButton>
        </Form>
      </Container>
    );
  }
}

export default EditTournamentGeneral;
