// @flow

import React from 'react';
// There's currently no type declaration for hydrate, but it exists
// $FlowFixMe
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

const root = document.getElementById('root');
if (root) {
    hydrate(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        root
    );
} else {
    throw new Error('Could not find react root');
}