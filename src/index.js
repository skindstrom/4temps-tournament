// @flow

import Express from 'express';
import Session from 'express-session';
import ConnectMongo from 'connect-mongo';
import forceSsl from 'express-force-ssl';
import Helmet from 'helmet';
import fs from 'fs';
import spdy from 'spdy';
import compression from 'compression';
import type { $Request, $Response } from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import bodyParser from 'body-parser';

import ApiRoute from './routes';
import getDbConnection from './data/setup';

import renderHtmlTemplate from './ssr-template';
import App from './app/components/App';

const app = Express();

// gzip compression
app.use(compression());
app.use(bodyParser.json());

const MongoStore = ConnectMongo(Session);
// TODO: use environment variable for secret
app.use(Session({
  name: 'SESSION',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // ~10 years
  },
  store: new MongoStore({mongooseConnection: getDbConnection()})
}));

app.use(Helmet());
app.set('forceSSLOptions', {
  httpsPort: 3001,
});
app.use(forceSsl);

// used for files that should be public, e.g. favicon etc.
app.use('/public', Express.static(path.join(__dirname, '../public')));
// used for files that should be public, but that's generated
app.use('/public', Express.static(path.join(__dirname, '../public-build')));

app.use('/api', ApiRoute);
app.use(handleRender);

// TODO: use environment variable for certs
const key = fs.readFileSync('encryption/server.key');
const cert = fs.readFileSync( 'encryption/server.crt');

// TODO: use environment variable for passphrase
spdy.createServer({ key, cert , passphrase: 'password'}, app).listen(3001);
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
