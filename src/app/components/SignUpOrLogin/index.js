// @flow
import React from 'react';
import type { RouterHistory } from 'react-router-dom';

import SignUpOrLogin from './component';

type Props = {
  history: RouterHistory,
  header: string,
  referer: string
}

const SignUpOrLoginWithRouter = ({ history, header, referer }: Props) =>
  (<SignUpOrLogin
    header={header}
    onClickLogin={() =>
      history.push(`/login?referer=${referer}`)}
    onClickSignUp={() =>
      history.push(`/signup?referer=${referer}`)}
  />);

export default SignUpOrLoginWithRouter;