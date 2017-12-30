// @flow
import type { Middleware, NextFunction, $Request, $Response } from 'express';

export const isAuthenticated: Middleware =
  (req: $Request, res: $Response, next: NextFunction) => {
    // $FlowFixMe
    if (req.session.user != null) {
      return next();
    }

    res.sendStatus(401);
  };

export default isAuthenticated;