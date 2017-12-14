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

export default App;