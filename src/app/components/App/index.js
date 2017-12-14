// @flow
import React from 'react';
import { Header } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';

import NavigationBar from '../NavigationBar';
import CreateTournament from '../CreateTournament';
import SignUp from '../SignUp';

const Home = () => 'Home!';

const App = () => {
  return (
    <div>
      <Header as='h1'> 4 Temps tournament website </Header>
      <NavigationBar />
      <Switch>
        <Route
          /* match both '/' and '/home' */
          path='/(|home)'
          /* '/' will match everything, make sure to be exact */
          exact
          component={Home}
        />
        <Route
          path='/create-tournament'
          render={() => <CreateTournament user={null} />}
        />
        <Route path='/signup' component={SignUp} />
      </Switch>
    </div>
  );
}

export default App;