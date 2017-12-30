// @flow
import type { NextFunction, $Request, $Response } from 'express';

export const isAuthenticated =
  (req: $Request, res: $Response, next: NextFunction) => {
    // $FlowFixMe
    if (req.session.user != null) {
      return next();
    }

    res.sendStatus(401);
  };

export default isAuthenticated;