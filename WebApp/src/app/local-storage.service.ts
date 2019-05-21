import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  getToken(){
  	return JSON.parse(localStorage.getItem('token'));
  }

  getAdmin(){
  	let admin = JSON.parse(localStorage.getItem('admin'));
  	return admin;
  }

  getUserType(){
    if (JSON.parse(localStorage.getItem('admin'))) {
      return 0;
    }
    else if (JSON.parse(localStorage.getItem('user'))) {
      return 1;

    }
    else{
      return 2;
    }
  }

  getAllProperties(){
     return JSON.parse(localStorage.getItem('properties'))
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

}
