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

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

const useStyles = makeStyles((theme) => ({
  root: {
      backgroundColor: 'inherit',
  },
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ResetPassword() {
  const classes = useStyles();

  const [state , setState] = useState({
    resetEmail : "",
    resetPassword : "",
    resetConfirmPassword : ""
  })
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doResetPassword = async event => 
    {
      event.preventDefault();     
      if( state.resetPassword == '' || state.resetEmail == '' || state.resetConfirmPassword == '' ){
        setMessage('Please fill out all fields!');
      }
      else if( state.resetPassword.length <= 8 ){
        setMessage('Password must have a length of 8 or more!');
      }
      else if( state.resetPassword != state.resetConfirmPassword ){
        setMessage('Passwords do not match!');
      }
      else{
        var js = 
        '{"email":"' + state.resetEmail + 
        '","password":"' + state.resetPassword 
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/reset',
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
            if( res.recoveryMode ==  'true' )
            {
                setMessage('Reroute to recovery');
                /*window.location.href = '/Recovery'; */
            }
            else
            {
                /*var user = {username:res.username,email:res.email,id:res.id,fname:res.firstName,lname:res.lastName}
                localStorage.setItem('user_data', JSON.stringify(user));*/

                setMessage('Password Change Successful');
                /*window.location.href = '/Dashboard';*/
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="resetEmail"
            label="Email"
            name="email"
            autoComplete="email"
            value = {state.resetEmail}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="resetPassword"
            autoComplete="current-password"
            value = {state.resetPassword}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="resetConfirmPassword"
            value = {state.resetConfirmPassword}
            onChange={handleChange}
          />
          <Grid item xs={12}>
              <span id="resetResult">{message}</span>
            </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick= {doResetPassword}
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </div>
  );
}
