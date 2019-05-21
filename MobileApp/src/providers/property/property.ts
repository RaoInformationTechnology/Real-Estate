import { Injectable } from '@angular/core';
import { UtilityProvider } from '../utility/utility';
import { Http, RequestOptions, Headers, Response, Request, RequestMethod, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class PropertyProvider {
	url;
	constructor(private utilitySer: UtilityProvider, public http: Http) {
		this.url = utilitySer.getServerUrl();
		console.log(this.url);
	}

	getAccessToken(){
		let headers = new Headers();
		let token = JSON.parse(localStorage.token); // your custom token getter function here
		headers.append('x-access-token', token);
		return headers;
	}

	addProperty(propertyModal){ //:Observable<any>
		let auth = this.getAccessToken();
		return this.http
		.post(this.url+"property/", propertyModal,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
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

	getPropertyType():Observable<any>{
		// let auth = this.getAccessToken();
		return this.http
		.get(this.url+"propertytype/")//{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getCountry():Observable<any>{
		return this.http
		.get(this.url+"country/")
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getCityByCountry(id):Observable<any>{
		return this.http
		.post(this.url+"city/countryWiseCities/",id)
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

	getAgentWiseProperty(id, count):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agentWiseProperty/"+id+"/"+count+"/1",{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getAgentWisePropertyCount(id):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agent-wise-property-count/"+id,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	getBuyOrRentProperty(option):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/buyOrRent/"+option,{headers:auth})
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}

	searchProperty(searchQuires){
		// let auth = this.getAccessToken();
		return this.http
		.post(this.url+"property/searchProperty/",searchQuires)//,{headers:auth}
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		})
	}


	uploadPropertyImage(postData: any, files: File[]){
		let headers = new Headers();
		let formData:FormData = new FormData();
		console.log("files", files);
		for(var i=0;i<files.length;i++){
			formData.append('foo', files[i] , files[i].name);
		}
		console.log("From Data", formData);

		if(postData !=="" && postData !== undefined && postData !==null){
			console.log("post data",postData);
			for (var file in postData) {
				if (postData.hasOwnProperty(file)) {
					formData.append(file, postData[file]);
				}
			}
		}
		console.log("New From Data", formData);
		var returnReponse = new Promise((resolve, reject) => {
			console.log("header",headers);
			this.http.post(this.url+"property/imageUpload", formData, {
				headers: headers
			}).subscribe(
			res => {
    		// this.responseData = res.json();
    			resolve(res);
    			console.log("Response",res);
    	},
    	error => {
    		// this.router.navigate(['/login']);
    		reject(error);
    	}
    	);
		});
		return returnReponse;
	}

	getExpiringProperties(id, count):Observable<any>{
		let auth = this.getAccessToken();
		return this.http
		.get(this.url+"property/agentWiseExpireProperty/"+id+"/"+count,{headers:auth})
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
		return this.http.put(this.url+"city", city)
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

	agentWiseExpiringProperty(id):Observable<any>{
		return this.http.get(this.url+"property/agentWiseExpiringPropertyCount"+id)
		.map(res =>{
			return res.json();
		},err =>{
			return err;
		});
	}

}
