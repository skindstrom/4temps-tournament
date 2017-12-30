// @flow

export type ApiRequest<T> = Promise<{
  // TODO: change to response
  result: ?T
}>

export type AuthorizedApiRequest<T> = Promise<{
  // TODO: change into "wasAuthorized"
  wasAuthenticated: boolean,
  // TODO: change to response
  result: ?T
}>

async function parseResponse<T>(response: Response): ApiRequest<T> {
  let result: ?T = null;
  if (response.status === 200) {
    result = await response.json();
  }
  return { result };
}

async function
parseAuthResponse<T>(response: Response): AuthorizedApiRequest<T> {
  const { result } = await parseResponse(response);
  const wasAuthenticated: boolean = response.status !== 401;
  return { wasAuthenticated, result };
}

export async function apiGetRequest<T>(url: string): ApiRequest<T> {
  return parseResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET',
      credentials: 'include'
    }));
}

export async function
apiAuthGetRequest<T>(url: string): AuthorizedApiRequest<T> {
  return parseAuthResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET',
      credentials: 'include'
    }));
}

export async function
apiAuthPostRequest<Body, T>(url: string,
  body: Body): AuthorizedApiRequest<T> {
  return parseAuthResponse(await fetch('/api/tournament/create',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include'
    }));
}