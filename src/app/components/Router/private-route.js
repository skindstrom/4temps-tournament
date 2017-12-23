// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { withRouter, Route } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import SignUpOrLogin from '../SignUpOrLogin';

type Props = {
  location: Location,
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
                referer={rest.location.pathname}
              />)}
      />
    );
  };


export default withRouter(PrivateRoute);