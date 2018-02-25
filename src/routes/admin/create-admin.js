// @flow
import type { $Request, $Response } from 'express';

import validateAdmin from '../../validators/validate-admin';
import type { RouteResult } from '../util';
import type { AdminCreateValidationSummary } from '../../validators/validate-admin';
import { createAdmin, getAdmins } from '../../data/admin';
import type { AdminModel } from '../../data/admin';

export const createAdminRoute = async (
  admin: AdminWithPassword,
  createAdmin: (admin: AdminWithPassword) => Promise<boolean>,
  getAdmins: () => Promise<Array<AdminModel>>
): RouteResult<AdminCreateValidationSummary> => {
  let status = 200;
  const validation = await validateAdmin(admin, getAdmins);

  if (validation.isValid) {
    const success = await createAdmin(admin);
    if (!success) {
      status = 500;
    }
  } else if (!validation.isEmailNotUsed) {
    status = 409;
  } else {
    status = 400;
  }

  return {
    status,
    body: validation
  };
};

export default async (req: $Request, res: $Response) => {
  const admin: AdminWithPassword = {
    // $FlowFixMe
    email: req.body.email || '',
    // $FlowFixMe
    firstName: req.body.firstName || '',
    // $FlowFixMe
    lastName: req.body.lastName || '',
    // $FlowFixMe
    password: req.body.password || ''
  };

  const { status, body } = await createAdminRoute(
    admin,
    createAdmin,
    getAdmins
  );
  res.status(status);
  res.json(body);
};
