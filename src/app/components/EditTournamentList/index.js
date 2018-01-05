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
    this.isFetchedCanceled = false;
    this._getTournaments();
  }

  componentWillUnmount() {
    this.isFetchedCanceled = true;
  }

  isFetchedCanceled = true;

  _getTournaments = async () => {
    const { result } = await getTournamentsForUser();
    if (result != null) {
      if (!this.isFetchedCanceled) {
        this.setState({ isLoading: false, tournaments: result });
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

export default EditTournamentListContainer;