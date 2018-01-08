// @flow
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import { logoutUser } from '../../api/user';

import NavigationBar from './component';

type Props = {
  location: Location,
  history: RouterHistory
}

function getActivePath(location: string): string {
  const matches = location.match(/\/(.+)\/?\??.*/);
  let activeName = 'home';
  if (matches) {
    activeName = matches[1];
  }
  return activeName;
}

type State = {
  isAuthenticated: boolean
}

function mapStateToProps({ isAuthenticated }: State, { location }: Props) {
  return {
    activePath: getActivePath(location.pathname),
    isAuthenticated
  };
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { history }: { history: RouterHistory }) {
  return {
    onClickLogout: () =>
      dispatch(({
        type: 'LOGOUT_USER',
        promise: logoutUser(),
        meta: {
          onSuccess: () => history.push('/')
        }
      }))
  };
}

const NavigationBarContainer =
  withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationBar));

export default NavigationBarContainer;