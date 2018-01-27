// @flow

import React from 'react';
import type { ComponentType } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import SignUpOrLogin from '../SignUpOrLogin';

type Props = {
  referer: string,
  path: string,
  component: ComponentType<*>,
  isAuthenticated: boolean,
}

const PrivateRoute =
  ({ component: Component, isAuthenticated, referer, ...rest }: Props) => {
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
                referer={referer}
              />)}
      />
    );
  };

function mapStateToProps({user}: ReduxState,
  { location }: { location: Location }) {
  return {
    isAuthenticated: user.id !== '',
    referer: location.pathname
  };
}

const PrivateRouteContainer =
  // $FlowFixMe
  withRouter(connect(mapStateToProps)(PrivateRoute));


export default PrivateRouteContainer;
