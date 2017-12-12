// @flow
import React, { Component } from 'react';
import { Form, FormField, Button } from 'semantic-ui-react';

import SignUp from './component';
import validateUser from './validator';
import type { UserCreateValidationSummary } from './validator';
import type { UserWithPassword } from './user';

type Props = {};

type State = {
    validation: UserCreateValidationSummary
};

class SignUpContainer extends Component<Props, State> {
    state = {
        validation: {
            isValid: true,
            isValidEmail: true,
            isValidFirstName: true,
            isValidLastName: true,
            isValidPassword: true
        },
    };

    render() {
        return (
            <SignUp
                onSubmit={this._onSubmit}
                validation={this.state.validation}
            />);
    }

    _onSubmit = async (user: UserWithPassword) => {
        this.setState({ validation: validateUser(user) });
    };
};

export default SignUpContainer;