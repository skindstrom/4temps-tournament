// @flow
import React, { Component } from 'react';
import { Form, FormField, Button } from 'semantic-ui-react';

import SignUp from './component';

type Props = {};

type State = {
    email: string,
    password: string,
};

class SignUpContainer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { email: '', password: '' };
    }

    render() {
        return (
            <SignUp
                email={this.state.email}
                onChangeEmail={(email) =>
                    this.setState({ email })}
                password={this.state.password}
                onChangePassword={(password) =>
                    this.setState({ password })}
                onSubmit={() => alert('Submitted!!')}
            />);
    }
};

export default SignUpContainer;