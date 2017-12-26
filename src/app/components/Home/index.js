// @flow

import React, { Component } from 'react';

import type { Tournament } from '../../../models/tournament';
import TournamentList from '../TournamentList';
import { getAllTournaments } from '../../api/tournament';

type Props = {}
type State = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
}


class Home extends Component<Props, State> {
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
    this.setState({ isLoading: true });
    const result = await getAllTournaments();
    if (!this.isFetchedCanceled) {
      this.setState({ isLoading: false, tournaments: result });
    }
  }

  render() {
    return <TournamentList {...this.state} />;
  }
}

export default Home;