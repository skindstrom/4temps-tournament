// @flow

import { connect } from 'react-redux';
import PreloadContainer from '../../PreloadContainer';
import Component from './component';
import type { StateProps } from './component';
import { getTemporaryNotesForDance } from '../../../api/note';

type Props = {
  tournamentId: string,
  danceId: string
};

function mapStateToProps({
  tournaments,
  rounds,
  notes
}: ReduxState): StateProps {
  const tournament = tournaments.byId[tournaments.forJudge];
  return {
    shouldLoad: !(notes.isLoading || notes.didLoad),
    Child: Component,
    isLastRound:
      rounds.byId[tournament.rounds[tournament.rounds.length - 1]].active
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, danceId }: Props
) {
  return {
    load: () =>
      dispatch({
        type: 'GET_NOTES',
        promise: getTemporaryNotesForDance(tournamentId, danceId)
      })
  };
}

const NoteTakerContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default NoteTakerContainer;
