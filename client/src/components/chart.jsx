import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../components/title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('01/20/20', 0),
  createData('01/21/20', 300),
  createData('01/22/20', 1000),
  createData('01/23/20', 800),
  createData('01/24/20', 1600),
  createData('01/25/20', 2000),
  createData('01/26/20', 2400),
  createData('01/27/20', 2400),
  createData('01/28/20', 3024),
];

export default function Chart() {
  const theme = useTheme();

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