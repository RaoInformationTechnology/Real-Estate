import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';


@Injectable()
export class UtilityService{
	SERVER_URL;
	IMAGE_URL;
	constructor() { 
		 // this.SERVER_URL = 'http://34.247.34.153:9000/';
		 // this.IMAGE_URL = "http://ec2-34-247-34-153.eu-west-1.compute.amazonaws.com:9000/";
		 this.SERVER_URL = 'http://localhost:9000/';
		 this.IMAGE_URL = "http://localhost/samsarcomServer/";
	}

	getServerUrl(): String {
		// console.log("Server Url",this.SERVER_URL);
		return this.SERVER_URL;
	}

	getImageUrl(): String {
		return this.IMAGE_URL;
	}
}
