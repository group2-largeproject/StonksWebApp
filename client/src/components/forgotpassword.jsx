import React from 'react';
import { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockClosedIcon from '@material-ui/icons/LockOpen';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import validateEmail from './emailvalidation';

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

export default function ForgotPassword() {
  const classes = useStyles();

  const [state , setState] = useState({
    forgotUsername : "",
    forgotEmail : ""
  })
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doForgotPass = async event => 
    {
      event.preventDefault();     
      if( state.forgotEmail == '' || state.forgotUsername == '' ){
        setMessage('Please fill out all fields!');
      }
      else if(!validateEmail(state.forgotEmail)){
        setMessage('Please enter a valid email address!');
      }
      else{
        var js = 
        '{"username":"' + state.forgotUsername + 
        '","email":"' + state.forgotEmail 
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/forgot',
            {
              method:'POST',
              body:js,
              headers:
              {
                'Content-Type': 'application/json',
                'Response-Type': 'text/html'
              }
            }
            );
            
            var res = await response.text();
            var stat = await response.status;

            if(stat == 401){ 
              setMessage('A user with the email address ' + state.forgotEmail +' was not found!');
            }
            else if(stat == 200){ 
              setMessage('Password reset email sent to : ' + state.forgotEmail);
            }
            else
            {
              setMessage(stat + ' : ' + res);
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
          <LockClosedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Account Recovery
        </Typography>
        <form className={classes.form} noValidate>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="forgotUsername"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value = {state.forgotUsername}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="forgotEmail"
            label="Email Address"
            name="email"
            autoComplete="email"
            value = {state.forgotEmail}
            onChange={handleChange}
          />
          <Grid item xs={12}>
            <span id="forgotResult">{message}</span>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick= {doForgotPass}
            color="primary"
            className={classes.submit}
          >
            Send Recovery Email
          </Button>
          <Grid container>
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