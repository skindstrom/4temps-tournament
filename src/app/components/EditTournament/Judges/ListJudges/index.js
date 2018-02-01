// @flow

import {connect} from 'react-redux';
import PreloadContainer from '../../../PreloadContainer';
import Component from './component';

import {getTournamentsForUser} from '../../../../api/tournament';

type Props = {
  tournamentId: string
}

function mapStateToProps({ judges }: ReduxState,
  { tournamentId }: Props) {
  return {
    Child: Component,
    shouldLoad: !judges.forTournament[tournamentId],
    judges:
      (judges.forTournament[tournamentId] || [])
        .map(id => judges.byId[id]),
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () => dispatch(
      {type: 'GET_USER_TOURNAMENTS', promise: getTournamentsForUser()}
    )
  };
}

const ListJudgesContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default ListJudgesContainer;
