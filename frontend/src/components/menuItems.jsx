import React from 'react';
import { NavLink } from 'react-router-dom';
import {Link, withRouter} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ListIcon from '@material-ui/icons/List';
import BarChartIcon from '@material-ui/icons/BarChart'; 
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToApp from '@material-ui/icons/ExitToApp';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

export const mainMenuItems = (
  <div>
    <MenuItem 
      button
      >
      <NavLink
      to = "/Dashboard"
      activeClassName = "selected"
      >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      </NavLink>
      <ListItemText primary="Dashboard" />

    </MenuItem>
    <MenuItem 
      button
      component = {NavLink}
      to = "/"
      >
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </MenuItem>
    <MenuItem 
      button
      >
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="Watchlist" />
    </MenuItem>
  </div>
);

export const secondaryMenuItems = (
  <div>
    <ListSubheader>Account</ListSubheader>
    <MenuItem 
      button
      >
      <ListItemIcon>
        <SettingsApplicationsIcon />
      </ListItemIcon>
      <ListItemText primary="Account Settings" />
    </MenuItem>
    <MenuItem 
      button
      >
      <ListItemIcon>
        <NotificationsActiveIcon />
      </ListItemIcon>
      <ListItemText primary="Notification Settings" />
    </MenuItem>
    <MenuItem 
      button
      >
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Sign Out" />
    </MenuItem>
  </div>
);
