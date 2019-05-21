import { Injectable } from '@angular/core';
import { UtilityService } from '../utility.service';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class PropertyTypeService {
	url;	
	constructor(private utilitySer: UtilityService,
				private http:Http) {
		this.url = utilitySer.getServerUrl();
		console.log(this.url);
	}

	getAccessToken(){
		let headers = new Headers();
		let token = JSON.parse(localStorage.token); // your custom token getter function here
		headers.append('x-access-token', token);
		return headers;
	}

	addPropertyType(propertyType):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.post(this.url+"propertytype/", propertyType, {headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	

	getPropertyTypes():Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.get(this.url+"propertytype/")///{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getPropertyType(propertytypeId):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"propertytype/"+propertytypeId, {headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	updatePropertyType(propertyType):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.put(this.url+"propertytype/", propertyType, {headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

}
