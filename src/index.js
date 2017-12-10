// @flow

import express from 'express';
import type { $Request, $Response } from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';

import renderHtmlTemplate from './ssr-template';
import App from './app/components/App'

const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(handleRender);
app.listen(3000, () => console.log('Started express server'));


// used for server side rendering of React components
function handleRender(req: $Request, res: $Response) {
    res.send(renderHtmlTemplate(renderToString(<App />)));
}
