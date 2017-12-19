// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { Route } from 'react-router-dom';

import SignUpOrLogin from '../SignUpOrLogin';

type Props = {
  path: string,
  component: ComponentType<*>,
  isAuthenticated: boolean,
}

const PrivateRoute =
  ({ component: Component, isAuthenticated, ...rest }: Props) => {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated === true
            ? <Component {...props} />
            : (
              <SignUpOrLogin
                {...props}
                header='Please log in or sign up'
                referer={rest.path}
              />)}
      />
    );
  };

export default PrivateRoute;