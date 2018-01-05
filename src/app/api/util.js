// @flow

export type ApiResponse<T> = { success: boolean, result: ?T };
export type ApiRequest<T> = Promise<ApiResponse<T>>;

async function parseResponse<T>(response: Response): ApiRequest<T> {
  let result: ?T = null;

  const contentType = response.headers.get('content-type');
  if (contentType != null && contentType.indexOf("application/json") !== -1) {
    result = await response.json();
  }

  return { success: response.status === 200, result };
}

export async function
apiGetRequest<T>(url: string, deserialize: ?(T) => T): ApiRequest<T> {
  const response = await parseResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET',
      credentials: 'include'
    }));

  if(response.result != null && deserialize != null) {
    return { success: response.success, result: deserialize(response.result) };
  }
  return response;
}

export async function
apiPostRequest<Body, T>(url: string,
  body: ?Body, deserialize: ?(T) => T): ApiRequest<T> {
  const response = await parseResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include'
    }));

  if(response.result != null && deserialize != null) {
    return { success: response.success, result: deserialize(response.result) };
  }
  return response;
}