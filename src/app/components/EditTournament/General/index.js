// @flow
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';

import { updateTournament } from '../../../api/tournament';

import { getAdminTournaments } from '../../../action-creators';

import EditTournamentGeneral from './component';
import PreloadContainer from '../../PreloadContainer';

type ConnectedProps = {
  tournamentId: string,
  history: RouterHistory
};

function mapStateToProps(
  { tournaments, rounds, judges, participants, ui }: ReduxState,
  { tournamentId }: ConnectedProps
) {
  return {
    ...ui.editTournament,
    tournament: {
      ...tournaments.byId[tournamentId],
      rounds: (rounds.forTournament[tournamentId] || []).map(
        id => rounds.byId[id]
      ),
      judges: (judges.forTournament[tournamentId] || []).map(
        id => judges.byId[id]
      ),
      participants: (participants.forTournament[tournamentId] || []).map(
        id => participants.byId[id]
      )
    },

    shouldLoad: !tournaments.byId[tournamentId],
    Child: EditTournamentGeneral
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { tournamentId, history }: ConnectedProps
) {
  return {
    onSubmit: (tournament: Tournament) =>
      dispatch({
        type: 'EDIT_TOURNAMENT',
        promise: updateTournament(tournamentId, tournament)
      }),
    onClickLeaderboard: () => history.push(`/leaderboard/${tournamentId}`),
    load: () => getAdminTournaments(dispatch)
  };
}

const EditTournamentGeneralConnectedContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer);

export default EditTournamentGeneralConnectedContainer;
