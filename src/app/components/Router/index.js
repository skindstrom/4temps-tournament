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
import PrivateRoute from './private-route';

type Props = {
  isAuthenticated: boolean,
  updatedAuthenticationState: () => void
}

const Router = ({ isAuthenticated, updatedAuthenticationState }: Props) => {
  return (
    <Switch>
      <Route path='/(|home)' exact component={Home} />
      <Route path='/signup' component={SignUp} />
      <Route
        path='/login'
        render={(props) =>
          (<Login
            {...props}
            updatedAuthenticationState={updatedAuthenticationState}
          />)}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        path='/tournament/create'
        exact
        component={CreateTournament}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        path='/tournament/edit'
        exact
        component={EditTournamentList}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        path='/tournament/edit/:tournamentId'
        exact
        component={EditTournament}
      />
      <Route component={FourOFour} />
    </Switch>
  );
};

export default Router;