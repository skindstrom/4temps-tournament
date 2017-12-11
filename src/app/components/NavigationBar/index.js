// @flow
import React from 'react';
import { Menu } from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <Menu>
            <Link to='/'>
                <Menu.Item
                    name='home'
                    active
                >
                    Home
                </Menu.Item>
            </Link>
            <Link to='/create-tournament'>
                <Menu.Item
                    name='create-tournament'
                >
                    Create Tournament
                </Menu.Item>
            </Link>
        </Menu>);

}



export default NavigationBar;