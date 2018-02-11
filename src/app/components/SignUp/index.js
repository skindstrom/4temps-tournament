// @flow
import { connect } from 'react-redux';
import type { Location, RouterHistory } from 'react-router-dom';

import SignUp from './component';
import type { AdminWithPassword } from '../../../models/admin';
import { createAdmin } from '../../api/admin';

type Props = {
  history: RouterHistory,
  location: Location
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.signUp;
}

function mapDispatchToProps(
  dispatch: ReduxDispatch,
  { history, location }: Props
) {
  return {
    onSubmit: (admin: AdminWithPassword) =>
      dispatch({
        type: 'SIGNUP',
        promise: createAdmin(admin),
        meta: {
          onSuccess: () => history.push('/login' + location.search)
        }
      })
  };
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUpContainer;
