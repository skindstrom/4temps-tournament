// @flow
import React from 'react';
import { Header } from 'semantic-ui-react';
import NavigationBar from '../NavigationBar';

const App = () => {
    return (
        <div>
            <Header as='h1'> 4 Temps tournament website </Header>
            <NavigationBar onClick={() => alert('Click')} />
            Some content here...
        </div>
    );
}

export default App;