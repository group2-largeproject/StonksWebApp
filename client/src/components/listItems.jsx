import React from 'react';
import {NavLink} from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import SignOut from '../components/signoutbutton';

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
    to = "/AddStock"
    className = "nav-link"
    activeClassName = "nav-link-active"
    >
    <ListItem button>
      <ListItemIcon>
        <AddBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Add Stock" />
    </ListItem>
    </NavLink>
  </div>
);

export const secondaryListItems = (
  <div>
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
    {/*<NavLink
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
    </NavLink>*/}
    <SignOut/>
    {/*<NavLink
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
    </NavLink>*/}
  </div>
);