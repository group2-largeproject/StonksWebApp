import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SettingsIcon from '@material-ui/icons/Settings';
import { Paper, TextField } from '@material-ui/core';

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

const useStyles = makeStyles((theme) => ({
  root: {
      backgroundColor: 'inherit',
      flexGrow: 1,
      alignItems: 'center',
      display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    alignItems: 'center',
  },
  avatar: {
    margin: 'auto',
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(7),
    width: theme.spacing(7),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formGroup: {
    alignItems: 'center',
  },
}));

/*FINISH FUNCTIONALITY:
* State change back to old when edit field is left blank on submit
* State change back to old when api denies or criteria isnt met
*/
export default function AccountSettings(){

  const classes = useStyles();

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  if(ud != null){
    var profileUsername = ud.username;
    var profileEmail = ud.email;
    var profileId = ud.id;
    var profileFN = ud.fname;
    var profileLN = ud.lname;
  }
  /*const [switchState, setSwitchState] = useState({
    emailNot: true,
    mobileNot: true,
  });*/
  const [state , setState] = useState({
    newUsername : profileUsername,
    newEmail : profileEmail,
    newFN : profileFN,
    newLN : profileLN
  })
  /*const handleSwitch = (e) => {
    setSwitchState({ ...switchState, [e.target.name]: e.target.checked });
  };*/
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doUpdateAccount = async event => 
    {
      event.preventDefault();     
      if( state.newUsername == ''){
        state.newUsername = profileUsername
        return;
      }
      if( state.newEmail == ''){
        state.newEmail = profileUsername
        return;
      }
      if( state.newFN == ''){
        state.newFN = profileFN
        return;
      }
      if( state.newLN == ''){
        state.newLN = profileLN
        return;
      }
      else{
        var js = 
        '{"username":"' + state.newUsername +
        '","email":"' + state.newEmail +
        '","firstName":"' + state.newFN +
        '","lastName":"' + state.newLN +
        '","id":"' + profileId
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/REPLACEWITHPATH',
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
                setMessage(res.error);
            }
            else
            {
                /*update local storage
                var user = {username:res.username,email:res.email,id:res.id,fname:res.firstName,lname:res.lastName}
                localStorage.setItem('user_data', JSON.stringify(user));*/

                setMessage('Update Successful');
                /*window.location.href = '/Profile';*/
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
      } 
    };
  return (
        <div className={classes.root}>
           <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
             <Grid item lg={12}>
               <Paper className={classes.paper}>
               <Avatar className={classes.avatar}><SettingsIcon/></Avatar>
               <br/>
               <Typography component="h1" variant="h4">Account Settings:</Typography>
               <TextField 
               display="inline" 
               variant="outlined"
              label="Username"
              margin="normal"
              name="newUsername"
              type="username"
              id="newUsername"
              defaultValue= {profileUsername}
              value = {state.newUsername}
              onChange={handleChange}
               />
               <br/>
               <TextField 
               display="inline"
               variant="outlined"
               label="Email" 
              margin="normal"
              name="newEmail"
              type="email"
              id="newEmail"
              value = {state.newEmail}
              onChange={handleChange}
               />
               <br/>
               <TextField 
               display="inline"
               variant="outlined"
               label="First Name"
              margin="normal"
              name="newFname"
              type="text"
              id="newFN"
              value = {state.newFN}
              onChange={handleChange}
               />
               <br/>
               <TextField 
               display="inline"
               variant="outlined"
               label="Last Name"
              margin="normal"
              name="newLN"
              type="text"
              id="newLN"
              value = {state.newLN}
              onChange={handleChange}
               />
               <br/>
               {/*<Typography component="h1" variant="body">Notifications:</Typography>
               <FormGroup className={classes.formGroup} row>
                <FormControlLabel
                  control={<Switch checked={state.emailNot} onChange={handleSwitch} name="checkedB" color="primary"/>}
                  label="Email"
                />
                <FormControlLabel
                  control={<Switch checked={state.mobileNot} onChange={handleSwitch} name="checkedB" color="primary"/>}
                  label="Mobile"
                />
              </FormGroup>*/}
               </Paper>
             </Grid>
             <Grid item lg={12}>
             <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick= {doUpdateAccount}
                  color="primary"
                  className={classes.submit}
                >
                  Update Account
                </Button>
             </Grid>
           </Grid>
         </div>
         
      );
  }