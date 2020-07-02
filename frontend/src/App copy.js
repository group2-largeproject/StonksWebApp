import React from 'react';
import LoginPage from '../src/pages/loginPage';
import RegisterPage from './pages/registerPage';
import Dashboard from './pages/dashboardPage';
import ForgotPage from './pages/forgotPage';
import ProfilePage from './pages/profilePage';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import Footer from './components/footer';
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Red from '@material-ui/core/colors/red';
import Blue from '@material-ui/core/colors/blue';
import Green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: Blue,
    secondary: Green,
    error: Red,
    notificationColor: Red,
  },
 });

function App() {  
  return (    
  <div id="main">
  <ThemeProvider theme={theme}>
  <Router >      
  <Switch>        
    <Route path="/" exact>          
      <LoginPage />        
    </Route>
    <Route path="/Login" exact>          
      <LoginPage />        
    </Route> 
    <Route path="/Register" exact>          
      <RegisterPage />        
    </Route>         
    <Route path="/Dashboard" exact>          
      <Dashboard />        
    </Route>
    <Route path="/ForgotPassword" exact>          
      <ForgotPage />        
    </Route>
    <Route path="/Profile" exact>          
      <ProfilePage />        
    </Route>          
    <Redirect to="/" />      
  </Switch>   
</Router>
<div id="footer">
  <Footer />
</div>
</ThemeProvider>
</div>
      );}
/*
function App() {
  return (
    <div>
      {<LoginPage />
      <RegisterPage />}
      <Dashboard />
    </div>
    
  );
}*/

export default App;
