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
import TimelineIcon from '@material-ui/icons/Timeline';

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

export default function AddStock(props){
  const classes = useStyles();

  var stockSymbol;
  //var stockQuantity;

  const [message,setMessage] = useState('');

  const doStockAdd = async event => 
    {
        

        event.preventDefault();

        /*var js = 
        '{"symbol":"' + stockSymbol.value + 
        '","quantity":"' + stockQuantity.value 
        +'"}';*/
        
        var js = 
        '{"symbol":"' + stockSymbol.value + '"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/addstock',
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

            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/Dashboard';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        } 
    };
  
  return (
      <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TimelineIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add a Stock!
          </Typography>
          <form className={classes.form} noValidate>
            {/*<Grid item xs={12}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="stockSymbol"
                  label="Stock Symbol"
                  name="stockSymbol"
                  autoComplete="ABC"
                  ref={(c) => stockSymbol = c}
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>  
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="stockQuantity"
                  label="Amount"
                  id="stockQuantity"
                  ref={(c) => stockQuantity = c}
                />
              </Grid>*/}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="stockSymbol"
                  label="Stock Symbol"
                  name="stockSymbol"
                  autoComplete="ABC"
                  ref={(c) => stockSymbol = c}
                  autoFocus
                />    
            </Grid>
            <Grid item xs={12}>
                <span id="stockAddResult">{message}</span>
              </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick= {doStockAdd}
              color="primary"
              className={classes.submit}
            >
              Add Stock
            </Button>
          </form>
        </div>
      </Container>
      </div>
    );
  }