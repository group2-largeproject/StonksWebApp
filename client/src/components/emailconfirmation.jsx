import React from 'react';
import { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MailIcon from '@material-ui/icons/Mail';
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

export default function EmailConfirmation() {
  const classes = useStyles();

  const [state , setState] = useState({
    emailToken : ""
  })
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doConfirmEmail = async event => 
    {
      event.preventDefault();     
      if( state.emailToken == ''){
        setMessage('Please fill out all fields!');
      }
      else{
        var js = 
        '{"verToken":"' + state.emailToken
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'confirmation',
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
                setMessage('Validation Successful Redirecting to Login...');
                var i = 0
                while(i<1000){
                  i++
                }
                window.location.href = '/';
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
          <MailIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Email Confirmation
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="emailToken"
            label="Email Token"
            name="emailtoken"
            value = {state.emailToken}
            onChange={handleChange}
            autoFocus
          />
          <Grid item xs={12}>
              <span id="confimationResult">{message}</span>
            </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick= {doConfirmEmail}
            color="primary"
            className={classes.submit}
          >
            Confirm Email
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    </div>
  );
}
