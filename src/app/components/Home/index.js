// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import type { Tournament } from '../../../models/tournament';
import TournamentList from '../TournamentList';
import { getAllTournaments } from '../../api/tournament';

type Props = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
  getTournaments: () => void
}

class Home extends Component<Props> {
  componentDidMount() {
    this.props.getTournaments();
  }

  render() {
    return <TournamentList {...this.props} />;
  }
}

function mapStateToProps({ tournaments }: ReduxState) {
  return {
    isLoading: tournaments.isLoading,
    tournaments: tournaments.allIds.map(id => tournaments.byId[id])
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    getTournaments: () => dispatch({
      type: 'GET_ALL_TOURNAMENTS',
      promise: getAllTournaments()
    })
  };
}

const HomeContainer =
  connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;