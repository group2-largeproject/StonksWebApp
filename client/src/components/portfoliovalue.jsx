import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './title';

const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 1,
  },
  avatar: {
    margin: 'auto',
    backgroundColor: theme.palette.primary.main,
    height: theme.spacing(5),
    width: theme.spacing(5),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(7),
  },
  title: {
    marginTop: theme.spacing(7),
  }
}));

export default function PortfolioValue() {
  const classes = useStyles();
  var date = new Date();
  return (
    <React.Fragment>
      {/*<Avatar className={classes.avatar}>
          <AttachMoneyIcon />
      </Avatar>*/}
      <Title className={classes.title}>Portfolio Value:</Title>
      <Typography className={classes.spacer} component="p" variant="h4">
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