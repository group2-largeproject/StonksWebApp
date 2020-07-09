import React from 'react';

export default function CreateFakeUser(){
    
    var fakeUser = "fakeu";
    var fakeEmail = "fake";
    var fakeId = 123;

    var user = {username:fakeUser,email:fakeEmail,id:fakeId}
    localStorage.setItem('user_data', JSON.stringify(user));
}