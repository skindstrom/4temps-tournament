// @flow

import React from 'react';
import {
  Header, Container, Dimmer, Loader, List, ListItem
} from 'semantic-ui-react';

import type { Tournament } from '../../../models/tournament';

const Item = ({ name, date, type }: Tournament) =>
  <ListItem header={`${name} - ${type}`} content={date.format('MM/DD/YYYY')} />;

type Props = {
  isLoading: boolean,
  previousTournaments: Array<Tournament>,
  futureTournaments: Array<Tournament>
}

const ModifyTournamentList =
  ({ previousTournaments, futureTournaments, isLoading }: Props) => {
    return (
      <Container>
        <Dimmer active={isLoading} >
          <Loader />
        </Dimmer>
        <Header as='h2'>
          Upcoming
        </Header>
        <List celled relaxed>
          {futureTournaments.map(tour =>
            <Item key={tour.date.toISOString()} {...tour} />)}
        </List>
        <Header as='h2'>
          Past
        </Header>
        <List celled relaxed>
          {previousTournaments.map(tour =>
            <Item key={tour.date.toISOString()} {...tour} />)}
        </List>
      </Container>
    );
  };

export default ModifyTournamentList;