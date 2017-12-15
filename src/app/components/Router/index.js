// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import CreateTournament from '../CreateTournament';
import SignUp from '../SignUp';
import Home from '../Home';
import Login from '../Login';


const Router = () => {
  return (
    <Switch>
      <Route path='/(|home)' exact component={Home} />
      <Route
        path='/create-tournament'
        render={() => <CreateTournament user={null} />}
      />
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
    </Switch>
  );
};

export default Router;