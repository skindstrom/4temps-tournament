// @flow
import type { UserCredentials } from '../../models/user';
import type { UserModel } from '../../data/user';
import validateUserLogin from '../../validators/validate-user-login';
import type { UserLoginValidationSummary } from
  '../../validators/validate-user-login';
import { getUserFromCredentials } from '../../data/user';
import type { RouteResult } from '../util';

export const loginUserRoute =
  async (credentials: UserCredentials,
    setSessionUser: (user: UserModel) => void,
    getUser: (user: UserCredentials)
      => Promise<?UserModel>): RouteResult<UserLoginValidationSummary> => {
    let status: number = 200;

    const validation =
      await validateUserLogin(credentials, getUser);

    if (validation.isValid) {
      const user = await getUser(credentials);

      // user should always be non-null if validation went through
      if (user != null) {
        setSessionUser(user);
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

    const setSessionUser = (user: UserModel) => {
      req.session.user = {
        id: user._id.toString(),
        role: 'admin'
      };
    };

    const { status, body } = await loginUserRoute(credentials,
      setSessionUser,
      getUserFromCredentials);

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

function parseBody(body: mixed): UserCredentials {
  if (typeof body === 'object' && body != null
    && typeof body.email === 'string' && typeof body.password === 'string') {
    return {
      email: body.email || '',
      password: body.password || ''
    };
  }

  throw new ParseError();
}

function ParseError() { }