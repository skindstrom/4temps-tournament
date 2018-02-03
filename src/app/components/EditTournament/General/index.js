// @flow
import { connect } from 'react-redux';

import type { Tournament } from '../../../../models/tournament';
import { updateTournament, getTournamentsForUser } from
  '../../../api/tournament';

import EditTournamentGeneral from './component';
import PreloadContainer from '../../PreloadContainer';

type ConnectedProps = {
  tournamentId: string
}

function mapStateToProps(
  { tournaments, rounds, judges, participants, ui }: ReduxState,
  { tournamentId }: ConnectedProps) {

  return {
    ...ui.editTournament,
    tournament: {
      ...tournaments.byId[tournamentId],
      rounds: (rounds.forTournament[tournamentId] || [])
        .map(id => rounds.byId[id]),
      judges: (judges.forTournament[tournamentId] || [])
        .map(id => judges.byId[id]),
      participants:
        (participants.forTournament[tournamentId] || [])
          .map(id => participants.byId[id]),
    },

    shouldLoad: !tournaments.byId[tournamentId],
    Child: EditTournamentGeneral,
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { tournamentId }: ConnectedProps) {
  return {
    onSubmit: (tournament: Tournament) => dispatch({
      type: 'EDIT_TOURNAMENT',
      promise: updateTournament(tournamentId, tournament)
    }),

    load: () => dispatch({
      type: 'GET_USER_TOURNAMENTS',
      promise: getTournamentsForUser()
    }),
  };
}

const EditTournamentGeneralConnectedContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default EditTournamentGeneralConnectedContainer;