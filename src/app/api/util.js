// @flow

async function parseResponse<T>(response: Response): Promise<T> {
  const { status } = response;
  const contentType = response.headers.get('content-type');
  const isCorrectContentType =
    contentType != null && contentType.indexOf("application/json") !== -1;

  if (status !== 200) {
    if (isCorrectContentType) {
      throw await response.json();
    }
    throw 'Failure from API';
  }
  if (status === 200 && isCorrectContentType) {
    return await response.json();
  } else if (status !== 200 && isCorrectContentType) {
    throw await response.json();
  } else if (status !== 200) {
    throw 'API Failure';
  } else {
    // $FlowFixMe
    return;
  }
}

export async function
apiGetRequest<T>(url: string, deserialize: ?(T) => T): Promise<T> {
  const response = await parseResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET',
      credentials: 'include'
    }));

  if(response != null && deserialize != null) {
    return deserialize(response);
  }
  return response;
}

export async function
apiPostRequest<Body, T>(url: string,
  body: ?Body, deserialize: ?(T) => T): Promise<T> {
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

  if(response != null && deserialize != null) {
    return deserialize(response);
  }
  return response;
}

export async function
apiDeleteRequest<T>(url: string, deserialize: ?(T) => T): Promise<T> {
  const response = await parseResponse(await fetch(url,
    {
      headers: {
        'Accept': 'application/json',
      },
      method: 'DELETE',
      credentials: 'include'
    }));

  if(response != null && deserialize != null) {
    return deserialize(response);
  }
  return response;
}
