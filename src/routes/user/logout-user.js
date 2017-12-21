// @flow
import type { $Request, $Response } from 'express';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  req.session.destroy(() => {
    res.sendStatus(200);
  });
};
