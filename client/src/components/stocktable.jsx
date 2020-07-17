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

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

/*
const [showMore, setShowMore] = React.useState(true)
{ showMore ? <ListSubheader>Account</ListSubheader> : null }
*/

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
  function createData(id, symbol, dailyquote, dailychange, profitsinceadded) {
    return { id, symbol, dailyquote, dailychange, profitsinceadded };
  }
  
  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  if(ud != null){
    var tableUsername = ud.username;
    /*var tableEmail = ud.email;
    var tableName = ud.fname + ' ' + ud.lname;
    var tableFN = ud.fname;
    var tableLN = ud.lname;*/
  }

  const doGetTableData = async event => 
    {
      event.preventDefault();     
      if(false){}
      else{
        var js = 
        '{"username":"' + tableUsername 
        +'"}';

        try
        {    
            const response = await fetch(BASE_URL + 'api/getData',
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
                alert(res.error);
            }
            else
            {
              alert('success');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
      }
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