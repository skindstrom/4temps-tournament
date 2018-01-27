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
  // This is the nodejs http server, but I can't seem to import the type
  // $FlowFixMe
  _server: any;

  constructor() {
    this._app = Express();
  }

  static initialize() {
    const server = new Server();

    server._enableCompression();
    server._enableBodyParsing();
    server._forceSsl();
    server._enableSessions();
    server._enableSecurePolicies();
    server._enableRouting();
    server._enableServerSideRendering();

    return server;
  }

  listen = () => {
    this._server = this._app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('Application started');
    });
  }

  stop = (onClose: () => void) => {
    this._server.close(onClose);
  }

  _enableCompression = () => {
    this._app.use(compression());
  }

  _enableBodyParsing = () => {
    this._app.use(bodyParser.json());
  }

  _forceSsl = () => {
    if (this._isProduction()) {
      this._app.use((req: $Request, res, next) => {
        const forwardedProto = req.header('X-Forwarded-Proto');

        if (req.originalUrl === '/health-check' || forwardedProto === 'https') {
          next();
        } else {
          const redirectUrl = 'https://' + String(req.header('Host')) +
            req.originalUrl;
          res.redirect(301, redirectUrl);
        }
      });
    }
  }

  _isProduction = () => {
    return process.env.NODE_ENV === 'production';
  }

  _enableSessions = () => {
    if (this._isProduction()) {
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
      proxy: this._isProduction(),
      cookie: {
        // Only use secure in prod
        secure: this._isProduction(),
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
    this._enableHealthCheckRouting();
  }

  _enablePublicDirectoryRouting = () => {
    // used for files that should be public, but is static
    this._app.use('/', Express.static(path.join(__dirname, '../public'), {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }));
    // used for files that should be public, but that's generated
    this._app.use('/',
      Express.static(path.join(__dirname, '../public-build'), {
        maxAge: 1000 * 60 * 60 // 1 day
      }));
  }

  _enableApiRouting = () => {
    this._app.use('/api', ApiRoute);
    this._app.use(/\/api\/.*/, (req: $Request, res: $Response) => {
      res.sendStatus(404);
    });
  }

  _enableHealthCheckRouting = () => {
    this._app.use('/health-check',
      (req: $Request, res: $Response) => {
        res.status(200);
        res.send(`I'm all healthy!`);
      });
  }

  _enableServerSideRendering = () => {
    this._app.use(this._renderRequest);
  }

  _renderRequest = (req: $Request, res: $Response) => {
    const context = {};

    const user = {
      // $FlowFixMe: Add user to req type
      id: req.session.user._id
    };

    const html = renderToString(
      <StaticRouter
        location={req.url}
        context={context}
      >
        {appWithPreloadedState({ user })}
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

export default Server;
