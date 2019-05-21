import { Injectable } from '@angular/core';
import { UtilityProvider } from '../utility/utility';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LoginProvider {
	url;
	constructor(private utilitySer: UtilityProvider, public http: Http) {
		this.url = utilitySer.getServerUrl();
		console.log(this.url);
	}

	login(user):Observable<any>{
		console.log(user);
		return this.http
		.post(this.url+"user/login/", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	signUp(user):Observable<any>{
		return this.http
		.post(this.url+"user/", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

}
