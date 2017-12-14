import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Components
import CreateTournament from '../CreateTournament';
import SignUp from '../SignUp';
import Home from '../Home';


const Router = () => {
  return(
    <router>
      <Switch>
        <Route path='/(|home)' exact component={Home} />
        <Route path='/create-tournament' render={() => <CreateTournament user={null} />} />
        <Route path='/signup' component={SignUp} />
      </Switch>
    </router>
  )
}

export default Router;