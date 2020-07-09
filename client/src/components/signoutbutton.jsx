import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';


export default function SignOut(){



    return(
        <ListItem button>
            <ListItemIcon>
                <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItem>
    );
}