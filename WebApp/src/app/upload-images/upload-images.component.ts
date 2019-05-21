import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../service/property.service';
import { LocalStorageService } from '../local-storage.service';
import { SweetalertService } from '../service/sweetalert.service';
import { UtilityService } from '../utility.service';
declare var $ : any;
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
	selector: 'app-upload-images',
	templateUrl: './upload-images.component.html',
	styleUrls: ['./upload-images.component.css']
})
export class UploadImagesComponent implements OnInit {
	private sub: any;
	upload = [];
	propertyId;
	property;
	images;
	image_url;
	public loading = false;
	view = 'location';

	public latitude: number;
	public longitude: number;
	public searchControl = new FormControl();
	public zoom: number;

	@ViewChild("search")
	public searchElementRef: ElementRef;
	constructor(private route: ActivatedRoute, private propertySer: PropertyService,
		private sweetAlertSer: SweetalertService,private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone, private _utilityService: UtilityService){
		this.image_url = this._utilityService.getImageUrl();
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.propertyId = params['id'];
			// console.log("Property Id:", this.propertyId);
			this.toggleView('location');
			this.getPropertyDetail(this.propertyId);

		});
	}

	toggleView(option){
		if(option == 'location'){
		console.log("Options",option);
			$("#location").css({
				'background-color' : '#ddd'
			});
			$("#image").css({
				'background-color' : 'white'
			})
			$("#updateProperty").css({
				'background-color' : 'white'
			})
		}else if(option == 'image'){
			$("#location").css({
				'background-color' : 'white'
			});
			$("#image").css({
				'background-color' : '#ddd'
			})
			$("#updateProperty").css({
				'background-color' : 'white'
			})
		}else if(option == 'updateProperty'){
			$("#location").css({
				'background-color' : 'white'
			});
			$("#image").css({
				'background-color' : 'white'
			})
			$("#updateProperty").css({
				'background-color' : '#ddd'
			})
		}
		this.view = option;
	}

	getMap(){
		if(this.property.lat != undefined && this.property.lon != undefined){
			this.zoom = 8;
			this.latitude = Number(this.property.lat);
			this.longitude = Number(this.property.lon);
		}else if(this.property.country._id == '5ab1fc482c1c50037e87adfd'){
			this.zoom = 4;
			this.latitude = 38.9637;
			this.longitude = 35.2433;
		}else{
			this.zoom = 4;
			this.latitude = 31.7917;
			this.longitude = -7.0926;
		}
		this.searchControl = new FormControl();

		// this.setCurrentPosition();

		this.mapsAPILoader.load().then(() => {
			// console.log("native",this.searchElementRef.nativeElement);
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();

					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.zoom = 10;
					// console.log("Lat", this.latitude);
					// console.log("Lon", this.longitude);
				});
			});
		});
	}

	setCurrentPosition() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this.zoom = 10;

			});
		}
	}

	markerDragEnd(event) {
		this.latitude = event.coords.lat;
		this.longitude = event.coords.lng;
	}

	submitLocation(){
		this.property.lat = this.latitude;
		this.property.lon = this.longitude;
		this.updateProperty(this.property,"Property maped on successfully");
	}

	getPropertyDetail(id){
		this.loading = true;
		this.propertySer
		.getProperty(id)
		.subscribe(data =>{
			this.property = data[0];
			console.log("Property Data", this.property);
			this.getMap();
			this.images = this.property.images;
			this.loading = false;
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	fileChange1(files: any) {
		this.upload = files;
		console.log(this.upload);
	}

	onSubmit(){
		console.log("Upload Images Length",this.upload.length);
		if(this.upload.length < 0){
			this.sweetAlertSer.sweetAlertNoFileChoosen('Please select atleast one image!');	
		} else if(this.upload.length > 0){

			let file = this.upload;
			console.log("Upload File",file);
	    	let postData = {'files':this.upload}; // Put your form data variable. This is only example.
	    	this.propertySer.uploadPropertyImage(postData,file).then(result => {
			for(var i=0; i<this.upload.length; i++){
				this.property.images.push('uploads/testuploads/'+this.upload[i].name);
			}
	    	this.updateProperty(this.property,"Property image uploaded successfully!");
	    	(document.getElementById('img_upload') as HTMLFormElement).reset();

	    	});
	    }

	}

	updateProperty(property,message){
		console.log(property);
		this.property.agent = property.agent._id;
		this.property.country = property.country._id;
		this.property.city = property.city._id;
		this.loading = true;
		this.propertySer
		.updateProperty(property)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert(message);
			if(message == "Property maped on successfully"){
				this.toggleView('image');
			}
			if(message == "Property details updated"){
				$('#updateModal').modal('toggle');
			}
			this.getPropertyDetail(this.propertyId);
			this.loading = false;
		},err=>{
			this.sweetAlertSer.sweetAlertError();
			this.loading = false;
		})
	}

	deleteImage(index){
		this.images.splice(index,1);
		this.property.images = this.images;
		this.updateProperty(this.property,"Property image deleted successfully !");
	}
}
