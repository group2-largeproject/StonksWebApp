import React from 'react';
import { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
    marginRight: theme.spacing(0.25),
  },
  submitL: {
    margin: theme.spacing(1, 0, 1),
    marginLeft: theme.spacing(0.25),
  },
}));

export default function AddStock(){
  const classes = useStyles();

  const [state , setState] = useState({
    stockSymbol : ""
  })
  const handleChange = (e) => {
    const {id , value} = e.target   
    setState(prevState => ({
        ...prevState,
        [id] : value
    }))
  }

  const [message,setMessage] = useState('');

  const doStockRemove = async event => 
    {
        event.preventDefault();
        var _ud = localStorage.getItem('user_data');
        var ud = JSON.parse(_ud);
        if(ud != null){
          var stockUsername = ud.username;
        }
        if( state.stockSymbol == '' ){
          setMessage('Stock Field cannot be blank!');
          return;
        }
        else{
          var js = 
          '{"stock":"' + state.stockSymbol.toUpperCase() +
          '","username":"' + stockUsername 
          + '"}';

          try
          {    
              const response = await fetch(BASE_URL + 'api/deleteStock',
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


              if( res.error != '' )
              {
                  setMessage(res.error);
              }
              else{
                setMessage('Stock removed successfully!')
                window.location.reload();
              }
          }
          catch(e)
          {
              alert(e.toString());
              return;
          }
        } 
    };

  const doStockAdd = async event => 
    {
        event.preventDefault();
        var _ud = localStorage.getItem('user_data');
        var ud = JSON.parse(_ud);
        if(ud != null){
          var stockUsername = ud.username;
        }
        if( state.stockSymbol == '' ){
          setMessage('Stock Field cannot be blank!');
          return;
        }
        else{
          var js = 
          '{"stock":"' + state.stockSymbol.toUpperCase() +
          '","username":"' + stockUsername 
          + '"}';

          try
          {    
              const response = await fetch(BASE_URL + 'api/addStock',
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


              if( res.error != '' )
              {
                  setMessage(res.error);
              }
              else{
                setMessage('Stock added successfully!')
                window.location.reload();
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
        {/*<Paper className={classes.paper}>*/}
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <TimelineIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Add/Remove
          </Typography>
          <form className={classes.form} noValidate>
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
                  value = {state.stockSymbol}
                  onChange = {handleChange}
                  autoFocus
                />    
            </Grid>
            <Grid item xs={12}>
                <span id="stockAddResult">{message}</span>
              </Grid>
            <Grid container justify= "center">
            <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick= {doStockAdd}
              color="primary"
              className={classes.submit}
            >
              Add
            </Button>
            </Grid>
            <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick= {doStockRemove}
              color="primary"
              className={classes.submitL}
            >
              Remove
            </Button>
            </Grid>
            </Grid>
          </form>
        </div>
        {/*</Paper>*/} 
      </Container>
      </div>
    );
  }