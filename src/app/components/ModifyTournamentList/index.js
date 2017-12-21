// @flow

import React, { Component } from 'react';
import moment from 'moment';

import type { Tournament } from '../../../models/tournament';
import ModifyTournamentList from './component';
import { getTournamentsForUser } from '../../api/tournament';

type Props = {}
type State = {
  isLoading: boolean,
  previousTournaments: Array<Tournament>,
  futureTournaments: Array<Tournament>
}


class ModifyTournamentListContainer extends Component<Props, State> {
  state = {
    isLoading: true,
    previousTournaments: [],
    futureTournaments: []
  }

  componentDidMount() {
    this._getTournaments();
  }

  _getTournaments = async () => {
    // TODO: cancel upon leaving the component
    const result = await getTournamentsForUser();
    if (result.wasAuthenticated && result.result != null) {
      // sort by latest date first
      const tournaments = result.result.sort(
        (a: Tournament, b: Tournament) =>
          a.date.isSameOrBefore(b.date) ? 1 : -1);

      const now = moment();
      const previousTournaments = tournaments
        .filter(tour => tour.date.isSameOrBefore(now));
      const futureTournaments = tournaments
        .filter(tour => tour.date.isSameOrAfter(now));

      this.setState({
        isLoading: false,
        previousTournaments,
        futureTournaments
      });
    } else {
      // TODO: do something else
      alert('Invalid login session');
    }
  }

  render() {
    return <ModifyTournamentList {...this.state} />;
  }
}

export default ModifyTournamentListContainer;