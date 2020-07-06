import React from 'react';
import List from '@material-ui/core/List';
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
import {makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ExitToApp from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ReactiveList() {
  const classes = useStyles();
  const selectedIndex = React.useState(1);

  if(window.location.href == "/Dashboard"){
    selectedIndex = 0;
  }
  else if(window.location.href == "/"){
    selectedIndex = 1;
  }

  return (
    <div>
      <List>
      <div className = {classes.root}>
        <ListItem 
          button
          selected={selectedIndex === 0}
          >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem  
          button
          selected={selectedIndex === 1}
          >
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem  
          button
          selected={selectedIndex === 2}
          >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Watchlist" />
        </ListItem>
      </div>
      </List>
      <Divider />
      <List>
      <div>
        <ListSubheader>Account</ListSubheader>
        <ListItem button
          selected={selectedIndex === 3}
          >
          <ListItemIcon>
            <SettingsApplicationsIcon />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </ListItem>
        <ListItem button
          selected={selectedIndex === 4}
          >
          <ListItemIcon>
            <NotificationsActiveIcon />
          </ListItemIcon>
          <ListItemText primary="Notification Settings" />
        </ListItem>
        <ListItem button
          selected={selectedIndex === 5}
          >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
      </div> 
      </List>
    </div>
  );
}