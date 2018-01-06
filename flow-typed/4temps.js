// @flow

declare type ApiResponse<T> = { success: boolean, result: ?T };
declare type ApiRequest<T> = Promise<ApiResponse<T>>;

// Redux
declare type ReduxDispatch = (action: ReduxAction) => any;
declare type ReduxState = {
  isAuthenticated: boolean
};
declare type ReduxAction = LogoutAction;

// Redux Actions
declare type LogoutAction =
  { type: 'LOGOUT_USER', promise: ApiRequest<boolean> };