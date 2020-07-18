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
        window.location.href = "/";
    }

    const doValidate = async event =>
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
              alert('Session Invalid Please Log In!');
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
              localStorage.removeItem('session_token');
              localStorage.setItem('session_token', JSON.stringify(newSession));
          }
      }
      catch(e)
      {
          alert(e.toString());
          return;
      }
    }
    doValidate();
    return;
}