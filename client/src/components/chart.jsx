import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../components/title';

const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';

const data = [];

// Generate Data
function createData(time, amount) {
  return { time, amount };
}
function getData(){
  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);

  if(ud != null){
    var chartUsername = ud.username;
  }
  chartUsername = "admin";
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
              for(var i=0;i<res.values.length;i++){
                if(res.values[i] == null){
                  res.values[i]=0;
                }
              }
              var table = {
                entry1:{date:res.dates[0],value:res.values[0]},
                entry2:{date:res.dates[1],value:res.values[1]},
                entry3:{date:res.dates[2],value:res.values[2]},
                entry4:{date:res.dates[3],value:res.values[3]},
                entry5:{date:res.dates[4],value:res.values[4]},
              }
              localStorage.setItem('table_data', JSON.stringify(table));
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
}
export default function Chart() {
  const theme = useTheme();
  var jsData;
  
  //const data = [];
  //console.log(data);
  var _td = localStorage.getItem('table_data');
  var td = JSON.parse(_td);
  var row1 = {"time":"0","amount":"0"};
  var row2 = {"time":"0","amount":"0"};
  var row3 = {"time":"0","amount":"0"};
  var row4 = {"time":"0","amount":"0"};
  var row5 = {"time":"0","amount":"0"};
  if(td != null){
    row1 = td.entry1;
    row2 = td.entry2;
    row3 = td.entry3;
    row4 = td.entry4;
    row5 = td.entry5;
  }
  const date = [
    row1,
    row2,
    row3,
    row4,
    row5
  ];
    console.log(data);
    

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