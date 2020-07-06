import React from 'react';

export default function Profile(props){
    return (
        <div className="Profile">
          <h1 className="Name">Username:{props.username}</h1>
          <div className="Details">
            <p className="Email">Email: {props.email}</p>
          </div>
          
        </div>
      );
  }