import { Injectable } from '@angular/core';
import { UtilityService } from '../utility.service';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class UserService {
	url;
	constructor(private utilitySer: UtilityService,
		private http: Http) {
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

	signUp(user):Observable<any>{
		return this.http
		.post(this.url+"user/", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
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

	fbLogin(user):Observable<any>{
		console.log(user);
		return this.http
		.post(this.url+"user/fbLogin/", user)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}


	getAvailability(id):Observable<any>{
		return this.http
		.get(this.url+"user/checkAvailability/"+id)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
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

	contactUs(inquery):Observable<any>{
		return this.http.post(this.url+"admin/contactUs", inquery)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getWorldCountries():Observable<any>{
		return this.http.get(this.url+"country/world-countries")
		.map(res =>{
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