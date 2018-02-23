// @flow
import { Header, Container, Divider } from 'semantic-ui-react';

import React from 'react';
import RoundInformation from './RoundInformation';
import NoteTaker from './NoteTaker';
import SelectPairGrid from './SelectPairGrid';
// $FlowFixMe
import SubmitNotesModal from './SubmitNotesModal';

type Props = {
  tournamentId: string,
  activeRound: ?Round,
  activeDanceId: ?string
};

export default function Judge({
  tournamentId,
  activeRound,
  activeDanceId
}: Props) {
  return activeRound != null && activeDanceId != null ? (
    <ActiveDance
      tournamentId={tournamentId}
      roundId={activeRound.id}
      danceId={activeDanceId}
    />
  ) : (
    <NoActiveDance />
  );
}

function NoActiveDance() {
  return (
    <Header as="h1" textAlign="center" vertical>
      No active dance
    </Header>
  );
}

type ActiveDanceProps = {
  roundId: string,
  danceId: string,
  tournamentId: string
};
function ActiveDance({ roundId, danceId, tournamentId }: ActiveDanceProps) {
  return (
    <Container>
      <RoundInformation />
      <SelectPairGrid roundId={roundId} />
      <Divider />
      <NoteTaker danceId={danceId} tournamentId={tournamentId} />
      <Divider />
      <SubmitNotesModal />
    </Container>
  );
}
