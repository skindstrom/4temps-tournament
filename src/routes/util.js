// @flow

export type RouteResult<T> = Promise<{
  status: number,
  body: T
}>;
