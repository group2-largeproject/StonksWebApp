import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  footer: {
      backgroundColor: 'inherit',
  },
}));

export default function Footer() {
  const classes = useStyles();
  
  return (
    <div className="footer">
      <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="primary" href="/">
        Stonks
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
    </div>
  );
}