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


class ModifyTournamentListContainer extends Component<Props, State> {
  state = {
    isLoading: true,
    tournaments: [],
  }

  componentDidMount() {
    this._getTournaments();
  }

  _getTournaments = async () => {
    // TODO: cancel upon leaving the component
    const result = await getTournamentsForUser();
    if (result.wasAuthenticated && result.result != null) {
      this.setState({ isLoading: false, tournaments: result.result });
    } else {
      // TODO: do something else
      alert('Invalid login session');
    }
  }

  render() {
    return <TournamentList {...this.state} />;
  }
}

export default ModifyTournamentListContainer;