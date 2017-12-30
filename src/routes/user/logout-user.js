// @flow
import type { $Request, $Response } from 'express';

export default async (req: $Request, res: $Response) => {
  // $FlowFixMe
  req.session.destroy(() => {
    res.status(200);
    res.json(true);
  });
};
