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

export default function Profile(props){
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