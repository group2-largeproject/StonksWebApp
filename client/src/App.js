import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

//Pages
import LoginPage            from '../src/pages/loginPage';
import RegisterPage         from './pages/registerPage';
import Dashboard            from './pages/dashboardPage';
import ForgotPage           from './pages/forgotPage';
import ProfilePage          from './pages/profilePage';
import AddStockPage         from './pages/addstockPage';
import AccountSettingsPage  from './pages/accountsettingsPage';
import PasswordResetPage    from './pages/passwordresetPage';
import Footer               from './components/footer';

//Auth
import PrivateRoute     from '../src/PrivateRoute';
import { AuthContext }  from './context/auth';

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
      <AuthContext.Provider value={ true }>
        <Router >      
          <Switch>        
            <Route path="/" exact component={ LoginPage }/>
            <Route path="/Login" exact component={ LoginPage }/>
            <Route path="/Register" exact component={ RegisterPage }/>     
            <Route path="/ForgotPassword" exact component={ ForgotPage }/>
            <PrivateRoute path="/Dashboard" exact component={ Dashboard }/>
            <PrivateRoute path="/Profile" exact component={ ProfilePage }/>
            <PrivateRoute path="/AddStock" exact component={ AddStockPage }/> 
            <PrivateRoute path="/AccountSettings" exact component={ AccountSettingsPage }/>
            <PrivateRoute path="/ResetPassword" exact component={ PasswordResetPage }/>                  
            <Redirect to="/" />      
          </Switch>   
        </Router>
        <div id="footer">
          <Footer />
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
  </div>
  );
}

export default App;
