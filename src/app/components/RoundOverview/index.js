// @flow

import { connect } from 'react-redux';
import type { Match, RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import Component from './component';
import { getTournamentsForUser } from '../../api/tournament';

type Props = {
  match: Match,
  history: RouterHistory
};

function mapStateToProps(state: ReduxState, { match }: Props) {
  const roundId = match.params.roundId || '';
  const tournamentId = match.params.tournamentId || '';
  return {
    shouldLoad: !state.rounds.byId[roundId],
    Child: Component,
    roundId,
    tournamentId
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch, { history }: Props) {
  return {
    load: () =>
      dispatch({
        type: 'GET_ADMIN_TOURNAMENTS',
        promise: getTournamentsForUser(),
        meta: {
          onFailure: () => history.push('/404')
        }
      })
  };
}

const RoundOverviewContainer = connect(mapStateToProps, mapDispatchToProps)(
  PreloadContainer
);

export default RoundOverviewContainer;
