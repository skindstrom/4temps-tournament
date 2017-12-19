// @flow
import type { $Request, $Response } from 'express';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  if (req.session.user != null) {
    // $FlowFixMe
    req.session.user = null;
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};
