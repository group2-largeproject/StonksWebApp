import React from 'react';
import { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../components/title';
import { get } from 'request';
import { useEffect } from 'react';


const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

export default function Chart() {
  const theme = useTheme();
  
  const [data , setData] = useState();

  useEffect(()=> {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
  
    if(ud != null){
      var chartUsername = ud.username;
    }
    //chartUsername = "admin";//REMOVE AFTER TESTING
    const doGetChartData = async event => 
      {    
        if(false){}
        else{
          var js = 
          '{"username":"' + chartUsername 
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
                const data = [];
                for(var i=0;i<res.values.length;i++){
                  if(res.values[i] == null){
                    res.values[i]=0;
                  }
                  data[i] = {"time":res.dates[i],"amount":res.values[i]}
                }
                setData(data)          
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
      doGetChartData();
  }, []);  

  return (
    <React.Fragment>
      <Title>History</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Portfolio Value ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}