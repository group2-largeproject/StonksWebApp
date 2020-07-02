import React from 'react';
import {NavLink} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
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

export const mainListItems = (
  <div>
    <NavLink
    exact
    to = "/Dashboard"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem 
      button
      >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    </NavLink>
    <NavLink
    exact
    to = "/profile"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem 
      button
      >
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
    </NavLink>
    <NavLink
    exact
    to = "/Watchlist"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem button>
      <ListItemIcon>
        <ListIcon />
      </ListItemIcon>
      <ListItemText primary="Watchlist" />
    </ListItem>
    </NavLink>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader>Account</ListSubheader>
    <NavLink
    exact
    to = "/AccountSettings"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem button>
      <ListItemIcon>
        <SettingsApplicationsIcon />
      </ListItemIcon>
      <ListItemText primary="Account Settings" />
    </ListItem>
    </NavLink>
    <NavLink
    exact
    to = "/NotificationSettings"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem button>
      <ListItemIcon>
        <NotificationsActiveIcon />
      </ListItemIcon>
      <ListItemText primary="Notification Settings" />
    </ListItem>
    </NavLink>
    <NavLink
    exact
    to = "/SignOut"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem button>
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Sign Out" />
    </ListItem>
    </NavLink>
  </div>
);