// @flow

import React, { Component } from 'react';

import type { Tournament } from '../../../models/tournament';
import TournamentList from '../TournamentList';
import { getTournamentsForUser } from '../../api/tournament';

type Props = {}
type State = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
}


class EditTournamentListContainer extends Component<Props, State> {
  state = {
    isLoading: true,
    tournaments: [],
  }

  componentDidMount() {
    this._getTournaments();
  }

  _getTournaments = async () => {
    try {
      const tournaments = await getTournamentsForUser();
      this.setState({ isLoading: false, tournaments });
    } catch (e) {
      this.setState({ isLoading: false, tournaments: [] });
    }
  }

  render() {
    return <TournamentList {...this.state} />;
  }
}

export default EditTournamentListContainer;