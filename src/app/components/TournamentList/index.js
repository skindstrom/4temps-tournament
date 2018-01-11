// @flow

import React, { Component } from 'react';
import {
  Header, Container, Loader,
  Table, TableRow, TableCell, TableBody
} from 'semantic-ui-react';
import moment from 'moment';
import type Moment from 'moment';

import type { Tournament, TournamentType } from '../../../models/tournament';

import './styles.css';

type Props = {
  isLoading: boolean,
  tournaments: Array<Tournament>,
  onClick: ?(tournamentId: string) => void
}

type State = {
  previousTournaments: Array<Tournament>,
  futureTournaments: Array<Tournament>
}

function getPreviousTournaments(tournaments: Array<Tournament>) {
  const now = moment();
  return sortTournaments(tournaments)
    .filter(tour => tour.date.isSameOrBefore(now));
}

function getFutureTournaments(tournaments: Array<Tournament>) {
  const now = moment();
  return sortTournaments(tournaments)
    .filter(tour => tour.date.isSameOrAfter(now));
}

function sortTournaments(tournaments: Array<Tournament>) {
  // sort by latest date first
  return tournaments.sort(
    (a: Tournament, b: Tournament) =>
      a.date.isSameOrBefore(b.date) ? 1 : -1);
}

class TournamentList extends Component<Props, State> {
  state = {
    previousTournaments: getPreviousTournaments(this.props.tournaments),
    futureTournaments: getFutureTournaments(this.props.tournaments),
  }

  componentWillReceiveProps(nextProps: Props) {
    const previousTournaments =
      getPreviousTournaments(nextProps.tournaments);
    const futureTournaments =
      getFutureTournaments(nextProps.tournaments);

    this.setState({ previousTournaments, futureTournaments });
  }

  _renderHeaderAndTournaments =
    (header: string, tournaments: Array<Tournament>) => {
      if (this._shouldRenderTable(tournaments)) {
        return (
          <div styleName='wrapper'>
            <Header as='h2'>
              {header}
            </Header>
            {this._renderTable(tournaments)}
          </div>
        );
      }
    }

  _renderTable = (tournaments: Array<Tournament>) => {
    return (
      <Table selectable textAlign='center' fixed>
        <TableBody>
          {tournaments.map(this._renderRow)}
        </TableBody>
      </Table>
    );
  }

  _shouldRenderTable = (tournaments: Array<Tournament>) => {
    return tournaments.length > 0;
  }

  _renderRow = ({ _id, name, date, type }: Tournament) => {
    const { onClick } = this.props;
    return (
      <TableRow
        key={_id}
        onClick={onClick != null ?
          () => onClick(_id) : null}
      >
        <TableCell>{name}</TableCell>
        <TableCell>{this._typeToName(type)}</TableCell>
        <TableCell>{this._formatDate(date)}</TableCell>
      </TableRow>
    );
  }

  _typeToName = (type: TournamentType): string => {
    if (type === 'jj') {
      return 'Jack n\' Jill';
    } else if (type === 'classic') {
      return 'Classic';
    }
    return 'Unknown';
  }

  _formatDate = (moment: Moment) => {
    return moment.format('LL');
  }

  render() {
    return (
      <Container text>
        {this.props.isLoading && <Loader active={this.props.isLoading} />}
        {this._renderHeaderAndTournaments('Upcoming',
          this.state.futureTournaments)}
        {this._renderHeaderAndTournaments('Past',
          this.state.previousTournaments)}
      </Container>
    );
  }
}

export default TournamentList;