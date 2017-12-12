// @flow
import React from 'react';

import { withRouter } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import { Button, Grid, GridRow, Header } from 'semantic-ui-react';

import './styles.css';

type Props = {
    header: string,
    onClickSignUp: () => void,
    onClickLogin: () => void,
};

const SignUpOrLogin = ({ header, onClickSignUp, onClickLogin }: Props) => {
    return (<Grid
        styleName='grid'
        columns={1}
        centered
    >
        <GridRow>
            <Header as='h3'>
                {header}
            </Header>    
        </GridRow>
        <GridRow>
            <Button
                styleName='button'
                primary
                onClick={onClickSignUp}
            >
                Sign up
            </Button>
        </GridRow>
        <GridRow>
            <Button
                styleName='button'
                secondary
                onClick={onClickLogin}
            >
                Log in
            </Button>
        </GridRow>
    </Grid>)
};

const SignUpOrLoginWithRouter =
    withRouter(({ history, header }: { history: RouterHistory, header: string }) =>
        (< SignUpOrLogin
            header={header}
            onClickLogin={() => history.push('/login')}
            onClickSignUp={() => history.push('/signup')}
        />)
    );

export default SignUpOrLoginWithRouter;