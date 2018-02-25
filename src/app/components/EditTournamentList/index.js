// @flow

import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';

import PreloadContainer from '../PreloadContainer';
import TournamentList from '../TournamentList';
import { getAdminTournaments } from '../../action-creators';

function mapStateToProps(
  { tournaments }: ReduxState,
  { history }: { history: RouterHistory }
) {
  if (
    tournaments.didLoadAdminTournaments &&
    tournaments.forAdmin.length === 0
  ) {
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
    load: () => getAdminTournaments(dispatch),
    onClick: (id: string) => history.push(`/tournament/edit/${id}`)
  };
}

const EditTournamentListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreloadContainer);

export default EditTournamentListContainer;
