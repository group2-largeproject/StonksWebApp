import React from 'react';
import {useState, useEffect} from 'react';
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

rows doesnt exist? fix error, commented out code so site still functions

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
  function createData(id, quantity, symbol, dailyquote, dailychange, dateupdated, profitsinceadded) {
    return { id, symbol, dailyquote};
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
  
export default function StockTable() {
  const classes = useStyles();
  const date = new Date();
  /*const [rows , setRows] = useState();

  const rowsTemp = [
    { "id":1, "symbol":"ABC", "dailyquote": 0},
    { "id":2, "symbol":"ABC", "dailyquote": 0},
    { "id":3, "symbol":"ABC", "dailyquote": 0},
    { "id":4, "symbol":"ABC", "dailyquote": 0},
  ];

  setRows(rowsTemp);


  useEffect(()=> {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);

    if(ud != null){
      var tableUsername = ud.username;
    }
    tableUsername = "admin";//REMOVE AFTER TESTING
    const doGetTableData = async event => 
      {    
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
              else if( res == null ){
                alert('No data to display!!')
              }
              else
              {
                const rows = [];
                for(var i=0;i<res.stocks.length;i++){
                  rows[i] = { "id":i, "symbol":res.stocks[i], "dailyquote": "0"}
                }
                console.log(rows);
                setRows(rows);          
                return;
              }
          }
          catch(e)
          {
              alert(e.toString());
              return;
          }
        }
      }
      doGetTableData();
  }, []);*/  
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
      <Typography display="inline" align="right" component="h2" variant="h6">As of: {date.getMonth()}/{date.getDate()}/{date.getFullYear()}</Typography>
      </Grid>
      <br/>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Row</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Daily Quote</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.symbol}</TableCell>
              <TableCell align="right">{row.dailyquote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*<div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          More
        </Link>
      </div>*/}
    </React.Fragment>
  );
}