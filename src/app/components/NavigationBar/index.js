// @flow
import React from 'react';
import { Menu, MenuItem } from 'semantic-ui-react';

import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Menu>
      <Link to='/'>
        <MenuItem
          name='home'
          active
        >
                    Home
        </MenuItem>
      </Link>
      <Link to='/create-tournament'>
        <MenuItem
          name='create-tournament'
        >
                    Create Tournament
        </MenuItem>
      </Link>
    </Menu>);

}



export default NavigationBar;