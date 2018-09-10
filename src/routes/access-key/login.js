// @flow

import type { AccessKeyRepository } from '../../data/access-key';
import isValidKey from '../../validators/validate-access-key';

export default function route(
  accessKeyRepo: AccessKeyRepository
): (req: ServerApiRequest, res: ServerApiResponse) => Promise<void> {
  return async (req, res) => {
    const key = parseAccessKey(req.body);

    if (isValidKey(key) && key != null) {
      loginWithKey(accessKeyRepo, key, req, res);
    } else {
      res.status(400);
      res.json({ isValidKey: false });
    }
  };
}

async function loginWithKey(
  accessKeyRepo: AccessKeyRepository,
  key: string,
  req: ServerApiRequest,
  res: ServerApiResponse
) {
  const accessKey = await accessKeyRepo.getForKey(key);

  if (accessKey == null) {
    res.status(404);
    res.json({ doesAccessKeyExist: false });
  } else {
    const user = { userId: accessKey.userId, role: accessKey.role };

    req.session.user = { id: user.userId, role: user.role };
    res.json(user);
  }
}

function parseAccessKey(body: mixed): ?string {
  if (
    body !== null &&
    typeof body === 'object' &&
    typeof body.accessKey === 'string' &&
    body.accessKey !== null
  ) {
    return body.accessKey;
  }

  return null;
}
