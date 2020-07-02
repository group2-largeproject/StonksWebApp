import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './title';

// Generate Order Data
function createData(id, quantity, symbol, dailyquote, dailychange, dateupdated, profitsinceadded) {
  return { id, quantity, symbol, dailyquote, dailychange, dateupdated, profitsinceadded };
}

const rows = [
  createData(1, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(2, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(3, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(4, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(5, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(6, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(7, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(8, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(9, 300,'ABC', 10, -5, '01/20/2020', 312.44),
  createData(10, 300,'ABC', 10, -5, '01/20/2020', 312.44),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function StockTable() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Performance</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Row</TableCell>
            <TableCell>Quantity</TableCell>
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
              <TableCell>{row.quantity}</TableCell>
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