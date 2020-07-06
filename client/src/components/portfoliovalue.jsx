import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function PortfolioValue() {
  const classes = useStyles();
  var date = new Date();
  return (
    <React.Fragment>
      <Title>Portfolio Value</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        As Of {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
      </Typography>
      <div>
      </div>
    </React.Fragment>
  );
}