import React from 'react';

export default function validateEmail(inputText){
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(inputText.match(mailformat)){
	return true;
	}
	else{
	return false;
	}
}