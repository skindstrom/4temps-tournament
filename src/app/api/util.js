// @flow

export type ApiRequest<T> = Promise<{
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
apiPostRequest<Body, T>(url: string,
  body: Body): ApiRequest<T> {
  return parseResponse(await fetch('/api/tournament/create',
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