// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';

import type { Tournament } from '../../../models/tournament';
import TournamentList from '../TournamentList';
import { getTournamentsForUser } from '../../api/tournament';

type Props = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
  onClick: (id: string) => void,
  getTournaments: () => void
}

class EditTournamentList extends Component<Props> {
  componentDidMount() {
    this.props.getTournaments();
  }

  render() {
    return (
      <TournamentList
        isLoading={this.props.isLoading}
        tournaments={this.props.tournaments}
        onClick={this.props.onClick}
      />
    );
  }
}

function mapStateToProps({ tournaments }: ReduxState) {
  return {
    isLoading: tournaments.isLoading,
    tournaments: tournaments.forUser.map(id => tournaments.byId[id])
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { history }: { history: RouterHistory }) {
  return {
    getTournaments: () => dispatch({
      type: 'GET_USER_TOURNAMENTS', promise: getTournamentsForUser()
    }),
    onClick: (id: string) => history.push(`/tournament/edit/${id}`)
  };
}

const EditTournamentListContainer =
  connect(mapStateToProps, mapDispatchToProps)(EditTournamentList);


export default EditTournamentListContainer;