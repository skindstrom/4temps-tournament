//@flow 

import React from 'react';
import SignUpOrLogin from '../SignUpOrLogin';

type Props = {
    user: ?string
};

const CreateTournament = (props: Props) => {
  if (props.user !== null) {
    return `You're ready to create a tournament!`;
  }
  return (
    <SignUpOrLogin
      header='An account is needed to create a tournament'
    />);
};

export default CreateTournament;