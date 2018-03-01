// @flow
import React from 'react';
import { Container, Table } from 'semantic-ui-react';
import '../styles.css';

export default function RemainingParticipants({
  participants
}: {
  participants: Array<Participant>
}) {
  return (
    <Container styleName="pad">
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Participant ID</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{participants.map(RemainingEntry)}</Table.Body>
      </Table>
    </Container>
  );
}
function RemainingEntry(participant: Participant) {
  return (
    <Table.Row key={participant.id}>
      <Table.Cell>{participant.attendanceId}</Table.Cell>
      <Table.Cell>{roleToString(participant.role)}</Table.Cell>
    </Table.Row>
  );
}

function roleToString(role: string) {
  switch (role) {
  case 'leader':
    return 'Leader';
  case 'follower':
    return 'Follower';
  case 'leaderAndFollower':
    return 'Both';
  default:
    return '';
  }
}
