// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import CreateTournament from '../CreateTournament';
import SignUp from '../SignUp';
import Home from '../Home';
import Login from '../Login';
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
        path='/create-tournament'
        exact
        component={CreateTournament}
      />
    </Switch>
  );
};

export default Router;