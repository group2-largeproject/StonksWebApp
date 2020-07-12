import React from 'react';
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

export default function Footer() {
  
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