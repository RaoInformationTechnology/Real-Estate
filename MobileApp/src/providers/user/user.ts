import { Injectable } from '@angular/core';
import { UtilityProvider } from '../utility/utility';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class UserProvider {
	url;
	constructor(public http: Http, private utilitySer: UtilityProvider) {
		this.url = utilitySer.getServerUrl();
		console.log(this.url);
	}

	getAccessToken(){
		let headers = new Headers();
		let token = JSON.parse(localStorage.token); // your custom token getter function here
		console.log("token", token);

		headers.append('x-access-token', token);
		return headers;
	}

	getUsers():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"user/full-information/users",{headers: auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getUser(id):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"user/single-information/"+id,{headers: auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	updateUser(user):Observable<any>{
		let auth = this.getAccessToken();

		return this.http
		.put(this.url+"user/", user,{headers: auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	verifyUser(user){
		console.log(user);
		return this.http
		.post(this.url+"user/userVerification", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getNewVerificationCode(user){
		console.log(user);
		return this.http
		.post(this.url+"user/newCodeGenerate", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	changePassword(user):Observable<any>{
		return this.http.post(this.url+"user/password-change",user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getWorldCountries():Observable<any>{
		return this.http.get(this.url+"country/world-countries")
		.map(res =>{
			console.log("countriesssssssss",res);
			return res.json();
		},err =>{
			return err;
		})
	}

	getCountryWiseWorldCities(id):Observable<any>{
		return this.http.post(this.url+"city/world-cities-by-country",id)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getEnteredCity(name):Observable<any>{
		return this.http
		.get(this.url+"city/world-city/"+name)
		.map(res =>{
			return res;
		},err =>{
			return err;
		});
	}

	updateCity(city):Observable<any>{
		return this.http.put(this.url+"city/world-city",city)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		});
	}

	addNewCity(city):Observable<any>{
		return this.http.post(this.url+"city/world-city",city)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		});
	}

}
