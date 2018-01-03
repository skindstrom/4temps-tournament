// @flow
import React, { Component } from 'react';
import { Container, Form, FormButton, FormInput, Message } from
  'semantic-ui-react';
import DatePicker from 'react-datepicker';
import type Moment from 'moment';

type Props = {
  isLoading: boolean,

  name: string,
  date: Moment,

  isValidName: boolean,
  isValidDate: boolean,

  onChangeName: (name: string) => void,
  onChangeDate: (date: Moment) => void,
  onSubmit: () => Promise<void>
}

class EditTournamentGeneral extends Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    const { name, date } = this.props;
    return name !== nextProps.name || date !== nextProps.date;
  }

  _onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.onChangeName(event.target.value);
  }

  _onChangeDate = (date: ?Moment) => {
    if (date != null) {
      this.props.onChangeDate(date);
    }
  }

  render() {
    return (
      <Container>
        <Form
          loading={this.props.isLoading}
          error={!this.props.isValidName || !this.props.isValidDate}
        >
          <FormInput
            label='Name'
            placeholder='4Temps World Championship'
            value={this.props.name}
            onChange={this._onChangeName}
          />
          {!this.props.isValidName &&
            <Message error content='Invalid name' />}
          <FormInput
            label='Date'
            control={DatePicker}
            allowSameDay
            selected={this.props.date}
            onChange={this._onChangeDate}
          />
          {!this.props.isValidDate &&
            <Message error content='Invalid date' />}
          <FormButton onClick={this.props.onSubmit} >
            Submit
          </FormButton>
        </Form>
      </Container>
    );
  }
}

export default EditTournamentGeneral;