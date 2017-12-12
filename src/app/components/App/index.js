// @flow
import React from 'react';
import { Header } from 'semantic-ui-react';
import { Route } from 'react-router-dom';

import NavigationBar from '../NavigationBar';
import CreateTournament from '../CreateTournament';

const Home = () => 'Home!';

const App = () => {
    return (
        <div>
            <Header as='h1'> 4 Temps tournament website </Header>
            <NavigationBar />
            <Route
                /* match both '/' and '/home' */
                path='/(|home)'
                /* '/' will match everything, make sure to be exact */
                exact
                component={Home}
            />
            <Route
                path='/create-tournament'
                render={(props) => <CreateTournament user={null} />}
            />
        </div>
    );
}

export default App;