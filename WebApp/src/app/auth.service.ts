import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthServices {
	loggedIn;
	constructor(private cookieService: CookieService) {
		if (sessionStorage.getItem('loggedIn') == 'true'){
			this.loggedIn = true;
		} 
		else{
			this.loggedIn = false;
		}
		// console.log(this.loggedIn);
		//this.loggedIn = true;
	}

	login() {
		let date = new Date().toDateString();
		sessionStorage.setItem('loginTime', date);
		sessionStorage.setItem('loggedIn', 'true');
		this.cookieService.set('loggedIn', 'true');
		this.loggedIn = true;
	}

	logout() {
		// console.log("logged out");
		sessionStorage.removeItem('loggedIn');
		sessionStorage.removeItem('loginTime');
		this.cookieService.delete('loggedIn');
		this.loggedIn = false;
	}
	
	check() {
		// console.log("Login Or Not",this.loggedIn);
		return Observable.of(this.loggedIn);
	}

}
