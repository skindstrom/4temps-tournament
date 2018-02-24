// @flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import TournamentList from '../TournamentList';
import { getTournamentsForUser } from '../../api/tournament';

function mapStateToProps({ tournaments }: ReduxState,
  { history }: { history: RouterHistory }) {
  if (tournaments.didLoadAdminTournaments
      && tournaments.forAdmin.length === 0) {
    // If we loaded all tournaments and list was empty redirect to create
    history.push('/tournament/create');
  }
  return {
    shouldLoad: !tournaments.didLoadAdminTournaments,
    isLoading: tournaments.isLoading,
    Child: TournamentList,
    tournaments: tournaments.forAdmin.map(id => tournaments.byId[id])
  };
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history }: { history: RouterHistory }
) {
  return {
    load: () =>
      dispatch({
        type: 'GET_ADMIN_TOURNAMENTS',
        promise: getTournamentsForUser()
      }),
    onClick: (id: string) => history.push(`/tournament/edit/${id}`)
  };
}

const EditTournamentListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer);

export default EditTournamentListContainer;
