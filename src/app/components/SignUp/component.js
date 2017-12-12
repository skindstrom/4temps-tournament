// @flow
import React, { PureComponent } from 'react';
import { Form, FormInput, Button } from 'semantic-ui-react';

import './styles.css';

type SignUpProps = {
    email: string,
    onChangeEmail: (string) => void,
    password: string,
    onChangePassword: (string) => void,
    onSubmit: () => void
};

const SignUp = (props: SignUpProps) => {
    return (
        <Form styleName='form'>
            <FormInput
                styleName='field'
                label='Email'
                placeholder='john@gmail.com'
                value={props.email}
                onChange={(event) =>
                    props.onChangeEmail(event.target.value)}

            />
            <FormInput
                styleName='field'
                label='Password'
                type='password'
                value={props.password}
                placeholder='P4ssw0rd'
                onChange={(event) =>
                    props.onChangePassword(event.target.value)}
            />
            <Button onClick={props.onSubmit} type='submit'>Submit</Button>
        </Form >
    );
};

export default SignUp;