// @flow
import type { AdminModel } from '../../data/admin';
import validateAdminLogin from '../../validators/validate-admin-login';
import type { AdminLoginValidationSummary } from '../../validators/validate-admin-login';
import { getAdminFromCredentials } from '../../data/admin';
import type { RouteResult } from '../util';

export const loginAdminRoute = async (
  credentials: AdminCredentials,
  setSessionAdmin: (admin: AdminModel) => void,
  getAdmin: (admin: AdminCredentials) => Promise<?AdminModel>
): RouteResult<AdminLoginValidationSummary> => {
  let status: number = 200;

  const validation = await validateAdminLogin(credentials, getAdmin);

  if (validation.isValid) {
    const admin = await getAdmin(credentials);

    // admin should always be non-null if validation went through
    if (admin != null) {
      setSessionAdmin(admin);
    } else {
      status = 500;
    }
  } else {
    status = 400;
  }

  return { status, body: validation };
};

export default async (req: ServerApiRequest, res: ServerApiResponse) => {
  try {
    const credentials = parseBody(req.body);

    const setSessionAdmin = (admin: AdminModel) => {
      req.session.user = {
        id: admin._id.toString(),
        role: 'admin'
      };
    };

    const { status, body } = await loginAdminRoute(
      credentials,
      setSessionAdmin,
      getAdminFromCredentials
    );

    res.status(status);
    res.json(body);
  } catch (e) {
    if (e instanceof ParseError) {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
};

function parseBody(body: mixed): AdminCredentials {
  if (
    typeof body === 'object' &&
    body != null &&
    typeof body.email === 'string' &&
    typeof body.password === 'string'
  ) {
    return {
      email: body.email || '',
      password: body.password || ''
    };
  }

  throw new ParseError();
}

function ParseError() {}
