// @flow
import React from 'react';
import { Menu, MenuItem } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import type { Location } from 'react-router-dom';

type Props = {
  location: Location
}

const NavigationBar = ({ location }: Props) => {
  const matches = location.pathname.match(/\/(.+)\/?\??.*/);
  let activeName = 'home';
  if (matches) {
    activeName = matches[1];
  }
  
  return (
    <Menu>
      <Link to='/'>
        <MenuItem
          name='home'
          active={activeName==='home'}
        >
          Home
        </MenuItem>
      </Link>
      <Link to='/create-tournament'>
        <MenuItem
          name='create-tournament'
          active={activeName==='create-tournament'}
        >
          Create Tournament
        </MenuItem>
      </Link>
    </Menu>);

};

const NavigationBarWithRouter = withRouter(NavigationBar);

export default NavigationBarWithRouter;