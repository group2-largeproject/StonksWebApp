import React from 'react';
import CreateFakeUser from './fakeuser';

export default function Profile(){

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  if(ud != null){
    var profileUsername = ud.username;
    var profileEmail = ud.email;
    var profileId = ud.id;
  }

  return (
        <div className="Profile">
          <button onClick = {CreateFakeUser}>CreateFakeUser</button>
          <h1 className="Name">Welcome: {profileUsername}</h1>
          <div className="Details">
            <p className="Email">Email: {profileEmail}</p>
            <p className="Id">User ID: {profileId}</p>
          </div>
          
        </div>
      );
  }