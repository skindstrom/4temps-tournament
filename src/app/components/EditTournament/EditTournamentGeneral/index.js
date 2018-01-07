// @flow

import React, { Component } from 'react';
import moment from 'moment';
import type Moment from 'moment';
import { connect } from 'react-redux';

import type { Tournament } from '../../../../models/tournament';
import { updateTournament, getTournamentsForUser } from
  '../../../api/tournament';

import EditTournamentGeneral from './component';

type Props = {
  isLoading: boolean,
  shouldLoad: boolean,
  tournament: Tournament,

  isValidName: boolean,
  isValidDate: boolean,

  getTournament: () => void,
  onSubmit: (tournament: Tournament) => void
}

type State = {
  name: string,
  date: Moment
}

class EditTournamentGeneralContainer extends Component<Props, State> {
  state = {
    name: this.props.shouldLoad ? '' : this.props.tournament.name,
    date: this.props.shouldLoad ? moment() : this.props.tournament.date
  }

  componentDidMount() {
    if (this.props.shouldLoad) {
      this.props.getTournament();
    }
  }

  componentWillReceiveProps({ tournament }: Props) {
    const { name, date } = tournament;
    if (!this.props.tournament
      || (this.props.tournament.name !== name
        || this.props.tournament.date !== date)) {
      this.setState({ name, date });
    }
  }

  _onChangeName = (name: string) => this.setState({name});

  _onChangeDate = (date: Moment) => this.setState({date});

  _onSubmit = async () => {
    const { name, date } = this.state;
    const tournament = { ...this.props.tournament, name, date };
    this.props.onSubmit(tournament);
  }

  render() {
    return (
      <EditTournamentGeneral
        isLoading={this.props.isLoading}

        name={this.state.name}
        date={this.state.date}

        isValidName={this.props.isValidName}
        isValidDate={this.props.isValidDate}

        onChangeName={this._onChangeName}
        onChangeDate={this._onChangeDate}
        onSubmit={this._onSubmit}
      />);
  }
}

type ConnectedProps = {
  tournamentId: string
}

function mapStateToProps({ tournaments }: ReduxState,
  { tournamentId }: ConnectedProps) {
  return {
    ...tournaments.uiEditTournament,
    shouldLoad: !tournaments.byId[tournamentId],
    isLoading: tournaments.isLoading || tournaments.uiEditTournament.isLoading,
    tournament: tournaments.byId[tournamentId]
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { tournamentId }: ConnectedProps) {
  return {
    getTournament: () => dispatch({
      type: 'GET_USER_TOURNAMENTS',
      promise: getTournamentsForUser()
    }),
    onSubmit: (tournament: Tournament) => dispatch({
      type: 'EDIT_TOURNAMENT',
      promise: updateTournament(tournamentId, tournament)
    })
  };
}

const EditTournamentGeneralConnectedContainer =
  connect(mapStateToProps, mapDispatchToProps)(EditTournamentGeneralContainer);

export default EditTournamentGeneralConnectedContainer;