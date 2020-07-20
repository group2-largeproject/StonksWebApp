import React from 'react';
import { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

export default function SignOut(){

    var _session = localStorage.getItem('session_token');
    var session = JSON.parse(_session);
    if(session != null){
        var logoutToken = session.token;
    }
    else{
        var logoutToken = '';
    }
    
    const [message,setMessage] = useState('');

    const doLogout = async event => 
    {
        event.preventDefault();     

        if(logoutToken == ''){
            alert("Error: Cannot log out with no session active!!");
        }
        else{

            var js = 
            '{"token":"' + logoutToken
            +'"}';

            try
            {    
                const response = await fetch(BASE_URL + 'api/logout',
                {
                    method:'POST',
                    body:js,
                    headers:
                    {
                    'Content-Type': 'application/json'
                    }
                }
                );

                var res = JSON.parse(await response.text());

                if( res.error !=  '' )
                {
                    alert(res.error);
                    window.location.href = '/';
                }
                else
                {
                    var session = {token:res.jwt}
                    localStorage.removeItem('user_data');
                    localStorage.removeItem('session_token');
                    localStorage.setItem('session_token', JSON.stringify(session));

                    //alert('Logout Successful');
                    window.location.href = '/';
                }
            }
            catch(e)
            {
                alert(e.toString());
                return;
            }
        console.log(message);
        }
      } 

    return(
        
        <ListItem button onClick= {doLogout}>
            <ListItemIcon>
                <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </ListItem>
    );
}
