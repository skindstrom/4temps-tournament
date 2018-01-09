// @flow

import Express from 'express';
import Session from 'express-session';
import ConnectMongo from 'connect-mongo';
import Helmet from 'helmet';
import compression from 'compression';
import type { $Request, $Response } from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import bodyParser from 'body-parser';

import { Provider } from 'react-redux';

import ApiRoute from './routes';
import getDbConnection from './data/setup';

import renderHtmlTemplate from './ssr-template';
import App from './app/components/App';

import createReduxStore from './app/redux-store';

const app = Express();

// gzip compression
app.use(compression());
app.use(bodyParser.json());

const MongoStore = ConnectMongo(Session);
app.use(Session({
  name: 'SESSION',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  /* Trust the reverse proxy for secure cookies */
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure in prod
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // ~10 years
  },
  store: new MongoStore({mongooseConnection: getDbConnection()})
}));

app.use(Helmet());

// used for files that should be public, e.g. favicon etc.
app.use('/public', Express.static(path.join(__dirname, '../public')));
// used for files that should be public, but that's generated
app.use('/public', Express.static(path.join(__dirname, '../public-build')));

app.use('/api', ApiRoute);
app.use(/\/api\/.*/, (req: $Request, res: $Response) => {
  res.sendStatus(404);
});
app.use(handleRender);

// used for server side rendering of React components
function handleRender(req: $Request, res: $Response) {
  const context = {};

  // $FlowFixMe: Add user to req type
  const isAuthenticated = req.session.user != null;

  // $FlowFixMe: A subset is ok
  const store = createReduxStore({ isAuthenticated });

  const html = renderToString(
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        <App />
      </StaticRouter>
    </Provider>
  );

  // redirects
  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
  } else {
    res.type('html');
    res.write(renderHtmlTemplate(html, store.getState()));
  }
  res.end();
}

export default function startServer() {
  let hostname = process.env.HOSTNAME;
  if (hostname == null) {
    hostname = 'localhost';
  }
  app.listen(parseInt(process.env.HTTP_PORT), hostname);
}