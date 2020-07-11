import React from 'react';
import CreateFakeUser from './fakeuser';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import { Paper } from '@material-ui/core';

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
}));

export default function Profile(){

  const classes = useStyles();

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  if(ud != null){
    var profileUsername = ud.username;
    var profileEmail = ud.email;
    var profileId = ud.id;
    var profileName = ud.fname + ' ' + ud.lname;
    var profileFN = ud.fname;
    var profileLN = ud.lname;
  }
function DeleteFakeUser(){
    localStorage.removeItem('user_data');
}
  return (
        <div className={classes.root}>
           <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
             <Grid item lg={12}>
               <Paper className={classes.paper}>
               <Avatar className={classes.avatar}><PersonIcon/></Avatar>
               <br/>
               <Typography component="h1" variant="h4">Profile:</Typography>
               <Typography display="inline" color ="primary" component="h1" variant="h6">Username: </Typography>
               <Typography display="inline" component="h1" variant="h6">{profileUsername}</Typography>
               <br/>
               <Typography display="inline" color ="primary" component="h1" variant="h6">Email: </Typography>
               <Typography display="inline" component="h1" variant="h6">{profileEmail}</Typography>
               <br/>
               <Typography display="inline" color ="primary" component="h1" variant="h6">Name: </Typography>
               <Typography display="inline" component="h1" variant="h6">{profileName}</Typography>
               <br/>
               <Typography display="inline" color ="primary" component="h1" variant="h6">User ID: </Typography>
               <Typography display="inline" component="h1" variant="h6">{profileId}</Typography>
               <br/>
               </Paper>
             </Grid>
             <Grid item lg={12}>
               <Button color="primary" href="/AccountSettings">
                 Edit
               </Button>
               <Button size="small" onClick = {CreateFakeUser}>CreateFakeUser</Button>
              <Button size="small" onClick = {DeleteFakeUser}>DeleteFakeUser</Button>
             </Grid>
           </Grid>
         </div>
      );
  }