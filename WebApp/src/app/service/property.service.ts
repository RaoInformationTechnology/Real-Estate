import { Injectable } from '@angular/core';
import { UtilityService } from '../utility.service';
import { Http, RequestOptions, Headers, Response, Request, RequestMethod, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class PropertyService {
	url;
	constructor(private utilitySer: UtilityService,
		private http:Http) {
		this.url = utilitySer.getServerUrl();
		// console.log(this.url);
	}

	getAccessToken(){
		let headers = new Headers();
		let token = JSON.parse(localStorage.token); // your custom token getter function here
		headers.append('x-access-token', token);
		return headers;
	}


	addProperty(property):Observable<any>{
		let auth = this.getAccessToken();
		// console.log("Properties", property);
		return this.http
		.post(this.url+"property/", property,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	addPropertyType(propertyType):Observable<any>{
		let auth = this.getAccessToken();
		// console.log("proprty type model",propertyType);
		return this.http
		.post(this.url+"propertytype/", propertyType,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getPropertyType():Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.get(this.url+"propertytype/")//,{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}


	getSearchByUniqueId(id):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/uid/"+id,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}



	getCities():Observable<any>{
		return this.http
		.get(this.url+"city/")
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getCountry():Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.get(this.url+"country/")
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getCityByCountry(id):Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.post(this.url+"city/countryWiseCities/",id)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	massUpload ( postData: any, files: File[]) {
		let headers = new Headers();
		let formData:FormData = new FormData();
		// console.log("files", files);
		formData.append('uploadedCsv', files[0] , files['name']);
		// console.log("From Data", formData);

		if(postData !=="" && postData !== undefined && postData !==null){
			// console.log("post data",postData);
			for (var property in postData) {
				if (postData.hasOwnProperty(property)) {
					formData.append(property, postData[property]);
				}
			}
		}
		var returnReponse = new Promise((resolve, reject) => {
			// console.log("header",headers);
			this.http.post(this.url+"property/mass-upload", formData, {
				headers: headers
			}).subscribe(
			res => {
    		// this.responseData = res.json();
    		resolve(res.json());
    	},
    	error => {
    		// this.router.navigate(['/login']);
    		reject(error);
    	}
    	);
		});
		return returnReponse;
	}

	uploadPropertyImage(postData: any, files: File[]){
		let headers = new Headers();
		let formData:FormData = new FormData();
		// console.log("files", files);
		for(var i=0;i<files.length;i++){
			formData.append('foo', files[i] , files[i].name);
		}
		// console.log("From Data", formData);

		if(postData !=="" && postData !== undefined && postData !==null){
			// console.log("post data",postData);
			for (var file in postData) {
				if (postData.hasOwnProperty(file)) {
					formData.append(file, postData[file]);
				}
			}
		}
		var returnReponse = new Promise((resolve, reject) => {
			// console.log("header",headers);
			this.http.post(this.url+"property/imageUpload", formData, {
				headers: headers
			}).subscribe(
			res => {
    		// this.responseData = res.json();
    		resolve(res);
    	},
    	error => {
    		// this.router.navigate(['/login']);
    		reject(error);
    	}
    	);
		});
		return returnReponse;
	}

	getProperties():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/",{headers:auth})//this.url+"property/",{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getProperty(id):Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/"+id)//this.url+"property/"+id,{headers: auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	changePropertyStatus(id,status):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/change-status/"+id+"/"+status,{headers:auth})//this.url+"property/"+id,{headers: auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	updateProperty(property):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.put(this.url+"property/", property,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getUnverifiedPropertyCount():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/unVerifiedCount",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}	

	getUnverifiedProperty(num):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/unVerified/"+num+"/1",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	verifyProperty(id, status):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/verify/"+id+"/"+status,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getAvailableProperty():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/available",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getOptionedPropertyCount(option):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/"+option+"Count",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getOptionedProperty(option, num, sortType):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/"+option+"/"+num+"/"+sortType,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getUnavailableProperty():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/blocked",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getAgentWiseProperty(id, number, sortType):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agentWiseProperty/"+id+"/"+number+"/"+sortType,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}
	getBuyOrRentProperty(option):Observable<any>{
		return this.http
		.get(this.url+"property/buyOrRent/"+option)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	searchProperty(searchQuires):Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.post(this.url+"property/searchProperty/",searchQuires)//{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getExpiringProperties(id,page):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agentWiseExpireProperty/"+id+'/'+page,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getExpiringPropertiesCount(id):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agentWiseExpirePropertyCount/"+id,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	renewProperty(cradential):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.post(this.url+"property/renueRequestAgent/",cradential,{headers:auth})//{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getRenueRequest():Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/renue/get-renue-requests/",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	deleteProperty(id):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.delete(this.url+"property/"+id,{headers: auth})//this.url+"property/"+id,{headers: auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getEnteredCity(name):Observable<any>{
		return this.http
		.get(this.url+"city/"+name)
		.map(res =>{
			return res;
		},err =>{
			return err;
		});
	}

	updateCity(city):Observable<any>{
		return this.http.put(this.url+"city",city)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		});
	}

	addNewCity(city):Observable<any>{
		return this.http.post(this.url+"city",city)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		});
	}
}