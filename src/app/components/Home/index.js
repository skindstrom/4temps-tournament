// @flow

import { connect } from 'react-redux';

import PreloadContainer from '../PreloadContainer';
import TournamentList from '../TournamentList';
import { getAllTournaments } from '../../api/tournament';

function mapStateToProps({ tournaments }: ReduxState) {
  return {
    shouldLoad: tournaments.isInvalidated,
    isLoading: tournaments.isLoading,
    Child: TournamentList,
    tournaments: tournaments.allIds.map(id => tournaments.byId[id])
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch) {
  return {
    load: () => dispatch({
      type: 'GET_ALL_TOURNAMENTS',
      promise: getAllTournaments()
    }),
    onClick: null
  };
}

const HomeContainer =
  connect(mapStateToProps, mapDispatchToProps)(PreloadContainer);

export default HomeContainer;