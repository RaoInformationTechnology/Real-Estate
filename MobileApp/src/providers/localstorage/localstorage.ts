import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageProvider {

	constructor() {
	}

	getAllProperties(){
		return JSON.parse(localStorage.getItem('properties'))
	}

	getToken(){
		return JSON.parse(localStorage.getItem('token'));
	}

	getUser(){
		return JSON.parse(localStorage.getItem('user'))
	}

	getUserName(){
		let name = JSON.parse(localStorage.getItem('user')).firstName +" "+ JSON.parse(localStorage.getItem('user')).lastName;
		return name;
	}	

	getUserFirstName(){
		let user = JSON.parse(localStorage.getItem('user'));
		return user.firstName;
	}

	getUserLastName(){
		return JSON.parse(localStorage.getItem('user')).lastName;
	}

	getUserId(){
		let id = JSON.parse(localStorage.getItem('user'))._id;
		return id;
	}

	getUserCompany(){
		return JSON.parse(localStorage.getItem('user')).company;
	}

	getUserAddress(){
		return JSON.parse(localStorage.getItem('user')).address;
	}

	getUserEmail(){
		return JSON.parse(localStorage.getItem('user')).email;
	}

	getUserPhone(){
		return JSON.parse(localStorage.getItem('user')).phone;
	}

	getUserMobile(){
		return JSON.parse(localStorage.getItem('user')).mobile;
	}

	getUserStatus(){
		return JSON.parse(localStorage.getItem('user')).userStatus;
	}

	getUserCity(){
		return JSON.parse(localStorage.getItem('user')).city;
	}

	getUserState(){
		return JSON.parse(localStorage.getItem('user')).state;
	}

	getUserCountry(){
		return JSON.parse(localStorage.getItem('user')).country;
	}

	getUserType(){
		if (JSON.parse(localStorage.getItem('user'))) {
			var user = JSON.parse(localStorage.getItem('user'));
			if ( user.userStatus == 'false' ) {
				return "BlockedAgent";
			}else if( user.userStatus == 'true') {
				return "Agent";
			}
			else{
				return "Guest";
			}
		}
		else{
			return "Guest";
		}
	}

	getUserLastSessionTime(){
		// return JSON.parse(localStorage.getItem('userSession'));
		console.log("Session",sessionStorage);
		if(localStorage.getItem('userSession')){
			return localStorage.getItem('userSession');
		}
	}

	setUserLastSessionTime(date){
		console.log(date);
		localStorage.setItem('userSession', date);
	}


}
