import React from 'react';
import { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import validateEmail from '../components/emailvalidation';

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();

  const [state , setState] = useState({
    registerUsername : "",
    registerPassword : "",
    registerConfirmPassword : "",
    registerEmail : "",
    registerFirstName : "",
    registerLastName : ""
  })
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doRegister = async event => 
    {
      event.preventDefault();

      if( state.registerUsername == '' || state.registerPassword == '' || state.registerEmail == '' || state.registerFirstName == '' || state.registerLastName == '' || state.registerConfirmPassword == '' ){
        setMessage('Please fill out all fields!');
      }
      else if( state.registerPassword.length <= 6 ){
        setMessage('Password must have a length of 6 or more!');
      }
      else if( state.registerPassword != state.registerConfirmPassword ){
        setMessage('Passwords do not match!');
      }
      else if(!validateEmail(state.registerEmail)){
        setMessage('Please enter a valid email address!')
      }
      else{
        var js = 
        '{"username":"' + state.registerUsername + 
        '","password":"' + state.registerPassword +
        '","email":"' + state.registerEmail +
        '","firstName":"' + state.registerFirstName +
        '","lastName":"' + state.registerLastName
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'register', //changed from /api/register server side
            {
              method:'POST',
              body:js,
              headers:
              {
                'Content-Type': 'application/json'
              }
            }
            );
            if(response.status == 200){
              setMessage("An email has been sent to " + state.registerEmail + " for verification! Check your spam folder!")
            }
            else{ 
              setMessage(response.statusText)
            }
            
            //var res = JSON.parse(await response.text());

            
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
      } 
    };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="registerUsername"
                label="Username"
                name="Username"
                autoComplete="username"
                value = {state.registerUsername}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="registerEmail"
                label="Email Address"
                name="email"
                autoComplete="email"
                value = {state.registerEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="registerPassword"
                autoComplete="current-password"
                value = {state.registerPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="registerConfirmPassword"                
                value = {state.registerConfirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="First Name"
              label="First Name"
              id="registerFirstName"
              value = {state.registerFirstName}
              onChange={handleChange}
            />
            </Grid>
            <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="Last Name"
              label="Last Name"
              id="registerLastName"
              value = {state.registerLastName}
              onChange={handleChange}
            />
            </Grid>
            <Grid item xs={12}>
              <span id="registerResult">{message}</span>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={doRegister}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}