// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import CreateTournament from '../CreateTournament';
import EditTournamentList from '../EditTournamentList';
import EditTournament from '../EditTournament';
import SignUp from '../SignUp';
import Home from '../Home';
import Login from '../Login';
import FourOFour from '../FourOFour';
import RoundOverview from '../RoundOverview';
import PrivateRoute from './private-route';

const Router = () => {
  return (
    <Switch>
      <Route path="/(|home)" exact component={Home} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <PrivateRoute
        path="/tournament/create"
        exact
        component={CreateTournament}
      />
      <PrivateRoute
        path="/tournament/edit"
        exact
        component={EditTournamentList}
      />
      <PrivateRoute
        path="/tournament/edit/:tournamentId"
        component={EditTournament}
      />
      <PrivateRoute
        path="/tournament/:tournamentId/round/:roundId"
        component={RoundOverview}
      />
      <Route component={FourOFour} />
    </Switch>
  );
};

export default Router;
