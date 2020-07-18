import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

//Pages
import LoginPage            from '../src/pages/loginPage';
import RegisterPage         from './pages/registerPage';
import Dashboard            from './pages/dashboardPage';
import ForgotPage           from './pages/forgotPage';
import ProfilePage          from './pages/profilePage';
import ManageStocksPage         from './pages/managestocksPage';
import AccountSettingsPage  from './pages/accountsettingsPage';
import PasswordResetPage    from './pages/passwordresetPage';
import EmailConfirmationPage from './pages/emailconfirmationPage';
import Footer               from './components/footer';

//Auth

//Themeing
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider }  from "@material-ui/styles";
import Red                from '@material-ui/core/colors/red';
import Blue               from '@material-ui/core/colors/blue';
import Green              from '@material-ui/core/colors/green';


//Main theme
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
          <Route path="/" exact component={ LoginPage }/>
          <Route path="/Login" exact component={ LoginPage }/>
          <Route path="/Register" exact component={ RegisterPage }/>     
          <Route path="/ForgotPassword" exact component={ ForgotPage }/>
          <Route path="/Dashboard" exact component={ Dashboard }/>
          <Route path="/Profile" exact component={ ProfilePage }/>
          <Route path="/ManageStocks" exact component={ ManageStocksPage }/> 
          <Route path="/AccountSettings" exact component={ AccountSettingsPage }/>
          <Route path="/ResetPassword" exact component={ PasswordResetPage }/> 
          <Route path="/EmailConfirmation" exact component={ EmailConfirmationPage }/>                  
          <Redirect to="/" />      
        </Switch>   
      </Router>
      <div id="footer">
        <Footer />
      </div>
    </ThemeProvider>
  </div>
  );
}

export default App;
