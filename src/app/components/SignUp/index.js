// @flow
import { connect } from 'react-redux';
import type { Location, RouterHistory } from 'react-router-dom';

import SignUp from './component';
import type { UserWithPassword } from '../../../models/user';
import { createUser } from '../../api/user';

type Props = {
  history: RouterHistory,
  location: Location
};

function mapStateToProps({ ui }: ReduxState) {
  return ui.signUp;
}

function mapDispatchToProps(dispatch: ReduxDispatch,
  { history, location }: Props) {
  return {
    onSubmit: (user: UserWithPassword) => dispatch({
      type: 'SIGNUP',
      promise: createUser(user),
      meta: {
        onSuccess: () => history.push('/login' + location.search)
      }
    })
  };
}

const SignUpContainer =
  connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUpContainer;