<<<<<<< 6d35ee7693ac5ede6e92bba571935962e3fd2b26
// @flow
import React from 'react';
import { Header } from 'semantic-ui-react';

import Router from '../Router';
import NavigationBar from '../NavigationBar';


const App = () => {
  return (
    <div>
      <Header as='h1'> 4 Temps tournament website </Header>
      <NavigationBar />
      <Router />
    </div>
  );
}

=======
// @flow
import React from 'react';
import { Header } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';

import Router from '../Router';
import NavigationBar from '../NavigationBar';


const App = () => {
    return (
        <div>
            <Header as='h1'> 4 Temps tournament website </Header>
            <NavigationBar />
            <Router />
        </div>
    );
}

>>>>>>> Moved components to router
export default App;