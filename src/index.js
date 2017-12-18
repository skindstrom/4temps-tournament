// @flow

import Express from 'express';
import Session from 'express-session';
import compression from 'compression';
import type { $Request, $Response } from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import bodyParser from 'body-parser';

import ApiRoute from './routes';

import renderHtmlTemplate from './ssr-template';
import App from './app/components/App';

const app = Express();

// gzip compression
app.use(compression());
app.use(bodyParser.json());
// TODO: use environment variable for secret
// TODO: use MongoDB as store
app.use(Session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // ~10 years
  }
}));

// used for files that should be public, e.g. favicon etc.
app.use('/public', Express.static(path.join(__dirname, '../public')));
// used for files that should be public, but that's generated
app.use('/public', Express.static(path.join(__dirname, '../public-build')));

app.use('/api', ApiRoute);
app.use(handleRender);
app.listen(3000);

// used for server side rendering of React components
function handleRender(req: $Request, res: $Response) {
  const context = {};

  // $FlowFixMe: Add user to req type
  const isAuthenticated = () => req.session.user != null;

  const html = renderToString(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <App isAuthenticated={isAuthenticated} />
    </StaticRouter>
  );

  // redirects
  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
  } else {
    res.write(renderHtmlTemplate(html, isAuthenticated()));
  }
  res.end();
}
