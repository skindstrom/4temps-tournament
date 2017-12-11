//@flow 

import React from 'react';

type Props = {
    user: ?string
};

const CreateTournament = (props: Props) => {
    if (props.user) {
        return `You're ready to create a tournament!`;
    } 
    return `Please log in or sign up`;
};

export default CreateTournament;