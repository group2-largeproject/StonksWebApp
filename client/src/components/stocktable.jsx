import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';


// Generate Order Data
function createData(id, symbol, dailyquote, dailychange, dateupdated, profitsinceadded) {
  return { id, symbol, dailyquote, dailychange, dateupdated, profitsinceadded };
}

const rows = [
  createData(1,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(3,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(2,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(4,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(5,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(6,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(7,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(8,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(9,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(10,'ABC', 10, -5, '01/20/2020', 312.44),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  title: {
    float: 'right',
  }
}));

export default function StockTable() {
  const classes = useStyles();
  const date = new Date();
  return (
    <React.Fragment>
      <Grid container justify="center" display="flex" direction="row" alignItems="flex-start" spacing={3}>
      <Grid item lg={3}>
      <Typography display="inline" align="left" component="h2" variant="h6" color="primary" gutterBottom>Performance</Typography>
      </Grid>
      <Grid item lg={3}>
      {/*spacer*/}
      </Grid>
      <Grid item lg={3}>
      {/*spacer*/}
      </Grid>
      <Grid justify="flex-end" item lg={3}>
      <Typography display="inline" align="right" component="h2" variant="h6">{date.getMonth()}/{date.getDate()}/{date.getFullYear()}</Typography>
      </Grid>
      <br/>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Row</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Daily Quote</TableCell>
            <TableCell>Daily Change</TableCell>
            <TableCell>Date Updated</TableCell>
            <TableCell align="right">Profit Since Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.symbol}</TableCell>
              <TableCell>{row.dailyquote}</TableCell>
              <TableCell>{row.dailychange}</TableCell>
              <TableCell>{row.dateupdated}</TableCell>
              <TableCell align="right">{row.profitsinceadded}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          More
        </Link>
      </div>
    </React.Fragment>
  );
}