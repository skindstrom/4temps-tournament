// @flow

import React, { Component } from 'react';
import {
  Header, Container, Loader, List, ListItem
} from 'semantic-ui-react';
import moment from 'moment';

import type { Tournament, TournamentType } from '../../../models/tournament';

type Props = {
  isLoading: boolean,
  tournaments: Array<Tournament>
}

type State = {
  previousTournaments: Array<Tournament>,
  futureTournaments: Array<Tournament>
}

class TournamentList extends Component<Props, State> {
  state = {
    previousTournaments: [],
    futureTournaments: []
  }

  componentWillReceiveProps(nextProps: Props) {
    // sort by latest date first
    const tournaments = nextProps.tournaments.sort(
      (a: Tournament, b: Tournament) =>
        a.date.isSameOrBefore(b.date) ? 1 : -1);

    const now = moment();
    const previousTournaments = tournaments
      .filter(tour => tour.date.isSameOrBefore(now));
    const futureTournaments = tournaments
      .filter(tour => tour.date.isSameOrAfter(now));

    this.setState({ previousTournaments, futureTournaments });
  }

  _typeToName = (type: TournamentType): string => {
    if (type === 'jj') {
      return 'Jack n\' Jill';
    } else if (type === 'classic') {
      return 'Classic';
    }
    return 'Unknown';
  }

  _renderItem = ({ name, date, type }: Tournament) => {
    return (
      <ListItem
        key={date.toISOString()}
        header={`${name} - ${this._typeToName(type)}`}
        content={date.format('MM/DD/YYYY')}
      />);
  };

  _renderUpcoming = () => {
    return (
      <div>
        <Header as='h2'>
        Upcoming
        </Header>
        <List celled relaxed>
          {this.state.futureTournaments.map(this._renderItem)}
        </List>
      </div>
    );
  }
  _renderPast = () => {
    return (
      <div>
        <Header as='h2'>
        Past
        </Header>
        <List celled relaxed>
          {this.state.previousTournaments.map(this._renderItem)}
        </List>
      </div>
    );
  }


  render() {
    return (
      <Container text>
        <Loader active={this.props.isLoading} />
        {this.state.futureTournaments.length > 0 && this._renderUpcoming()}
        <div style={{ padding: 10 }} />
        {this.state.previousTournaments.length > 0 && this._renderPast()}
      </Container>
    );
  }
}

export default TournamentList;