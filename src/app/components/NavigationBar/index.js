// @flow
import React from 'react';
import { Menu } from 'semantic-ui-react';

type Props = {
    onClick: () => void,
};

const NavigationBar = (props: Props) => {
    return (
        <Menu>
            <Menu.Item
                name='home'
                active
                onClick={props.onClick}
            >
                Home
            </Menu.Item>
            <Menu.Item
                name='create-tournament'
                onClick={props.onClick}
            >
                Create Tournament
            </Menu.Item>
        </Menu>);

}

export default NavigationBar;