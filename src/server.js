// @flow

import Express from 'express';
import Session from 'express-session';
import ConnectMongo from 'connect-mongo';
import Helmet from 'helmet';
import compression from 'compression';
import type {
  $Application as ExpressApplication,
  $Request, $Response
} from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';

import ApiRoute from './routes';
import getDbConnection from './data/setup';

import renderHtmlTemplate from './ssr-template';
import { appWithPreloadedState, getReduxState } from './app/components/App';

class Server {
  _app: ExpressApplication;

  constructor() {
    this._app = Express();
  }

  static start() {
    const server = Server.initialize();
    server.listen();
  }

  static initialize() {
    const server = new Server();

    server._enableCompression();
    server._enableBodyParsing();
    server._enableSessions();
    server._enableSecurePolicies();
    server._enableRouting();
    server._enableServerSideRendering();

    return server;
  }

  listen = () => {
    this._app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('Application started');
    });
  }

  _enableCompression = () => {
    this._app.use(compression());
  }

  _enableBodyParsing = () => {
    this._app.use(bodyParser.json());
  }

  _enableSessions = () => {
    if (process.env.NODE_ENV === 'production') {
      // trust 1 hop of reverse proxy
      this._app.set('trust proxy', 1);
    }

    const MongoStore = ConnectMongo(Session);
    this._app.use(Session({
      name: 'SESSION',
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      // Trust the reverse proxy for secure cookies
      proxy: true,
      cookie: {
        // Only use secure in prod
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // ~10 years
      },
      store: new MongoStore({ mongooseConnection: getDbConnection() })
    }));
  }

  _enableSecurePolicies = () => {
    this._addCspNonceToResponse();
    this._app.use(Helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'",
            (req: $Request, res: $Response) =>
              // $FlowFixMe
              `'nonce-${res.locals.cspNonce}'`],
          styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
          fontSrc: ['cdnjs.cloudflare.com', 'fonts.gstatic.com', 'data:'],
          formAction: ["'self'"]
        }
      }}));
  }

  _addCspNonceToResponse = () => {
    // Add a CSP nonce to allow inline scripts
    this._app.use((req: $Request, res: $Response, next) => {
      res.locals.cspNonce = uuid();
      return next();
    });
  }

  _enableRouting = () => {
    this._enablePublicDirectoryRouting();
    this._enableApiRouting();
  }

  _enablePublicDirectoryRouting = () => {
    // used for files that should be public, but is static
    this._app.use('/public', Express.static(path.join(__dirname, '../public'), {
      maxAge: 1000 * 60 * 60 // 1 hour
    }));
    // used for files that should be public, but that's generated
    this._app.use('/public',
      Express.static(path.join(__dirname, '../public-build'), {
        maxAge: 1000 * 60 * 60 // 1 hour
      }));
  }

  _enableApiRouting = () => {
    this._app.use('/api', ApiRoute);
    this._app.use(/\/api\/.*/, (req: $Request, res: $Response) => {
      res.sendStatus(404);
    });
  }

  _enableServerSideRendering = () => {
    this._app.use(this._renderRequest);
  }

  _renderRequest = (req: $Request, res: $Response) => {
    const context = {};

    // $FlowFixMe: Add user to req type
    const isAuthenticated = req.session.user != null;

    const html = renderToString(
      <StaticRouter
        location={req.url}
        context={context}
      >
        {appWithPreloadedState({ isAuthenticated })}
      </StaticRouter>
    );

    // redirects
    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      });
    } else {
      res.type('html');
      res.write(renderHtmlTemplate(html, getReduxState(),
        // $FlowFixMe: It's set a bit higher up
        res.locals.cspNonce));
    }
    res.end();
  }
}

export default Server.start;