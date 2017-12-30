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
    this.isFetchedCanceled = false;
    this._getTournaments();
  }

  componentWillUnmount() {
    this.isFetchedCanceled = true;
  }

  isFetchedCanceled = true;

  _getTournaments = async () => {
    const response = await getTournamentsForUser();
    if (response != null) {
      if (!this.isFetchedCanceled) {
        this.setState({ isLoading: false, tournaments: response });
      }
    } else {
      // TODO: do something else
      alert('Something went wrong');
    }
  }

  render() {
    return <TournamentList {...this.state} />;
  }
}

export default ModifyTournamentListContainer;