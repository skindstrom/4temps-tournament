// @flow
import { Header, Container, Divider } from 'semantic-ui-react';

import React from 'react';
import RoundInformation from './RoundInformation';
import NoteTaker from './NoteTaker';
import SelectPairGrid from './SelectPairGrid';
// $FlowFixMe
import SubmitNotesModal from './SubmitNotesModal';
// $FlowFixMe
import NoteTable from './NoteTable';
import DrawSettler from './DrawSettler';

export type Props = {
  tournamentId: string,
  judgeType: JudgeType,
  activeRound: ?Round,
  activeDanceId: ?string,
  notesSubmitted: boolean
};

export default function Judge({
  tournamentId,
  activeRound,
  activeDanceId,
  notesSubmitted,
  judgeType
}: Props) {
  if (activeRound != null && activeRound.draw) {
    return <Draw activeRound={activeRound} judgeType={judgeType} />;
  } else if (activeRound != null && activeDanceId != null) {
    return (
      <ActiveDance
        tournamentId={tournamentId}
        roundId={activeRound.id}
        danceId={activeDanceId}
        notesSubmitted={notesSubmitted}
      />
    );
  }
  return <NoActiveDance />;
}

function Draw({
  judgeType,
  activeRound
}: {
  judgeType: JudgeType,
  activeRound: Round
}) {
  if (judgeType === 'president') {
    return <DrawSettler activeRound={activeRound} />;
  }

  return <strong>Waiting for president to settle draw...</strong>;
}

function NoActiveDance() {
  return (
    <Header as="h1" textAlign="center">
      No active dance
    </Header>
  );
}

type ActiveDanceProps = TakeNotesProps & {
  notesSubmitted: boolean
};
function ActiveDance(props: ActiveDanceProps) {
  return (
    <Container>
      <RoundInformation />
      <Divider />
      {props.notesSubmitted ? <ShowNotes /> : <TakeNotes {...props} />}
    </Container>
  );
}

type TakeNotesProps = {
  roundId: string,
  danceId: string,
  tournamentId: string
};

function TakeNotes({ danceId, tournamentId, roundId }: TakeNotesProps) {
  return (
    <Container>
      <SelectPairGrid roundId={roundId} />
      <Divider />
      <NoteTaker danceId={danceId} tournamentId={tournamentId} />
      <Divider />
      <SubmitNotesModal />
    </Container>
  );
}

function ShowNotes() {
  return (
    <Container>
      <NoteTable />
    </Container>
  );
}
