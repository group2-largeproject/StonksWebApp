import react from 'react';

export default function isAuthenticated(){
    const BASE_URL = 'https://cop4331-large-group2.herokuapp.com/';
    var _session = localStorage.getItem('session_token');
    var session = JSON.parse(_session);
    if(session != null){
        var validateToken = session.token;
    }
    else{
        var validateToken = '';
    }

    const doLogin = async event =>
    {
      var js = 
      '{"token":"' + validateToken  
      +'"}';

      try
      {    
          const response = await fetch(BASE_URL + 'api/validation',
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
              alert('Session Invalid!');
              window.location.href = '/'
          }
          else if( res.jwt == '' )
          {
              alert('Token Response Error!')
              window.location.href = '/'
          }
          else
          {
              var newSession = {token:res.jwt}
              localStorage.setItem('session_token', JSON.stringify(newSession));
            
              alert('Page Validation Successful!');
              return;
          }
      }
      catch(e)
      {
          alert(e.toString());
          return;
      }
    }
    //Testing Start
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    if(ud != null){
        var profileUsername = ud.username;
        var profileID = ud.id;
        var profileEmail = ud.email;
        var profileName = ud.fname + ' ' + ud.lname;
        var profileFN = ud.fname;
        var profileLN = ud.lname;
    }
    if(profileID == 123){
        return;
    }
    else{//Testing End
        doLogin(); 
    }// <-- Remove after test
}