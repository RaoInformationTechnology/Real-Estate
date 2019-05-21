import { Component, NgZone, OnInit, ViewChild , ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UtilityProvider } from '../../providers/utility/utility';
import * as $ from 'jquery';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { UpdatePropertyPage} from '../update-property/update-property'

@Component({
	selector: 'page-upload-property-image',
	templateUrl: 'upload-property-image.html',
})

export class UploadPropertyImagePage implements OnInit {
	
	property;
	images;
	pId;
	upload=[];
	image_url;
	imageURI:any;
	imageFileName:any;
	option;
	loader;
	public latitude: number;
	public longitude: number;
	public searchControl = new FormControl();
	public zoom: number;
	flag;
	searchRef: ElementRef;
	@ViewChild('search')search : ElementRef;

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private _propertySer: PropertyProvider, private transfer: FileTransfer,
		public loadingCtrl: LoadingController, public toastCtrl: ToastController,
		private utilitySer: UtilityProvider, private fileChooser: FileChooser, private mapsAPILoader: MapsAPILoader,
		private ngZone: NgZone, private alertCtrl: AlertController) {
		this.pId = this.navParams.get('_id');
		this.flag = this.navParams.get('flag');
		this.image_url = this.utilitySer.getImageUrl();
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
			// duration: 2000
		});
	}

	ngOnInit(){
		this.searchControl = new FormControl();
		this.getPropertyDetail(this.pId);
		this.toggleView('location');
	}

	ionViewDidLoad() {
	}

	toggleView(view){
		console.log("view",view);
		if(view == 'location'){
			$("#location").css({
				'color' : '#0b7997'
			});
			$("#image").css({
				'color' : '#488aff'
			})
		}else if(view == 'image'){
			$("#location").css({
				'color' : '#488aff'
			});
			$("#image").css({
				'color' : '#0b7997'
			})
		}
		// this.view = option;
		this.option = view;
	}

	getMap(lat, lon, country){
		console.log("Lat", lat);
		console.log("Lon", lon);
		this.searchRef = this.search;
		console.log(this.searchRef);
		if(lat != "" && lon != ""){
			this.zoom = 12;
			this.latitude = Number(lat);
			this.longitude = Number(lon);
		}
		else if(country == 'Turkey'){
			this.zoom = 12;
			this.latitude = 38.9637;
			this.longitude = 35.2433;
		}
		else if(country == 'Morocco'){
			this.zoom = 12;
			this.latitude = 31.7917;
			this.longitude = -7.0926;
		}

		this.mapsAPILoader.load().then(() => {
			console.log(this.searchRef.nativeElement);
			let autocomplete = new google.maps.places.Autocomplete(this.searchRef.nativeElement);

			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();

					console.log(place);
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					console.log(place.geometry.location);
					this.property.lat = place.geometry.location.lat();
					this.property.lon = place.geometry.location.lng();
					this.zoom = 16;
					console.log("Lat", this.latitude);
					console.log("Lon", this.longitude);
						// this.setCurrentPosition();
					});
			});
		});



	}

	markerDragEnd(event) {
		this.latitude = event.coords.lat;
		this.longitude = event.coords.lng;
	}

	submitLocation(){
		this.property.lat = this.latitude;
		this.property.lon = this.longitude;
		this.updateProperty(this.property,"Property location Successfully Updated");
		this.option = 'image';
	}


	getPropertyDetail(id){
		this._propertySer
		.getProperty(id)
		.subscribe(data =>{
			this.property = data[0];
			console.log("Property List", this.property);
			this.property.lat = '';
			this.property.lon = '';
			this.getMap(this.property.lat, this.property.lon, this.property.country.name);
			
			this.images = this.property.images;
			console.log("Images", this.images);
			
		},err =>{
			console.error(err);
		})
	}

	fileChange1(files: any) {
		this.upload = files;
		console.log("selected Files",files);
	}

	onSubmit(){
		if (this.upload.length <= 0) {
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: "Please select atleast one image",
				buttons: ['OK']
			});
			alert.present();
		}else{

		console.log("Upload Data",this.upload);
		let file = this.upload;
    	let postData = {'files':this.upload}; // Put your form data variable. This is only example.
    	this.presentLoading();
    	this.loader.present();
    	this._propertySer.uploadPropertyImage(postData,file).then(result => {

		for(var i=0;i<this.upload.length;i++){
			console.log(this.upload[i].name);
			this.property.images.push('uploads/testuploads/'+this.upload[i].name);
		}
    	this.updateProperty(this.property,"Image uploaded Successfully!");

    	});
			
		}

    	

    }

    updateProperty(property, message){
    	console.log('Property', property);

    	this.property.agent = this.property.agent._id;
    	this.property.country = this.property.country._id;
    	this.property.city = this.property.city._id;
    	console.log('Property', property);
    	this._propertySer
    	.updateProperty(property)
    	.subscribe(data =>{
			this.loader.dismiss();
    		let alert = this.alertCtrl.create({
				title: 'Success!',
				subTitle: message,
				buttons: ['OK']
			});
			alert.present();
    		this.getPropertyDetail(this.pId);
    	},err=>{
    		console.error(err);
    		this.loader.dismiss();
    	})
    }

    deleteImage(index){
    	this.presentLoading();
    	this.loader.present();
    	console.log("Index",index);
    	this.images.splice(index,1);
    	console.log(this.images.length);
    	this.property.images = this.images;
    	this.updateProperty(this.property,"Image deleted Successfully !");
    }

    updataProperty(property){
		this.navCtrl.push(UpdatePropertyPage, {data: this.property, flag:this.flag});
	}

}
