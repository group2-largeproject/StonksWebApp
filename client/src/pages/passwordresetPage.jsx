import React from 'react';
import PasswordReset from '../components/passwordreset.jsx';
import isAuthenticated from '../components/authCheck';

const PasswordResetPage = () =>
{    
    isAuthenticated();
    return(      
    <div>              
        <PasswordReset />      
    </div>    
    );
};

export default PasswordResetPage;