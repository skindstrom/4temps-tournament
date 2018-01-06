// @flow
import React from 'react';

import Router from '../Router';
import NavigationBar from '../NavigationBar';

const App = () =>
  (
    <div>
      <NavigationBar />
      <Router />
    </div>
  );

export default App;