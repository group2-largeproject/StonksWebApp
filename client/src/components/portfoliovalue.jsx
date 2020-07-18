import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './title';
import { useEffect } from 'react';
import { useState } from 'react';

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

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

function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function PortfolioValue() {
  const classes = useStyles();
  var date = new Date();

  const [portfolioValue , setValue] = useState();

  useEffect(()=> {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
  
    if(ud != null){
      var valueUsername = ud.username;
    }
    //valueUsername = "admin";//REMOVE AFTER TESTING
    const doGetPortfolioValue = async event => 
      {    
        if(false){}
        else{
          var js = 
          '{"username":"' + valueUsername 
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
                setValue('Error!')
              }
              else
              {
                var value = 0;
                /*var i = 0;
                while(res.values[i]==null){
                  i++
                }*/
                value = res.values[4];
                var valueWithCommas = addCommas(value);
                setValue(valueWithCommas);          
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
      doGetPortfolioValue();
  }, []); 

  return (
    <React.Fragment>
      {/*<Avatar className={classes.avatar}>
          <AttachMoneyIcon />
      </Avatar>*/}
      <Title className={classes.title}>Portfolio Value:</Title>
      <Typography className={classes.spacer} component="p" variant="h4">
        ${portfolioValue}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        As Of {date.getMonth()+1}/{date.getDate()}/{date.getFullYear()}
      </Typography>
      <div>
      </div>
    </React.Fragment>
  );
}