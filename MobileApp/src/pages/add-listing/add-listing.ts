import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PropertyProvider } from '../../providers/property/property';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UploadPropertyImagePage } from '../upload-property-image/upload-property-image';

@Component({
	selector: 'page-add-listing',
	templateUrl: 'add-listing.html',
})
export class AddListingPage {
	buttonColor: string = '#0b7997';
	createProperty: FormGroup;
	@ViewChild('fileInput') fileInput: ElementRef;
	upload=[];
	agentId;
	propertyTypes;
	Type;
	currency="euro";
	selectedCountry={country:''};
	countries;
	cities;
	user;
	city;
	cityId;
	state="";
	rooms: number;
	flag:boolean=false;
	newCity:string;
	newState:string;
	loader
	constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController,
				private propertySer: PropertyProvider, private localStorageSer: LocalstorageProvider,
				private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		this.createForm();
		this.agentId = this.localStorageSer.getUserId();
		this.user = this.localStorageSer.getUser();
	}

	createForm(){
		this.createProperty = new FormGroup({
			propertyType: new FormControl(""),
			propertyAddress: new FormControl("", Validators.required),
			agent: new FormControl(""),
			postalCode: new FormControl("", Validators.required),
			city: new FormControl(""),
			state: new FormControl(""),
			country: new FormControl(""),
			// status: new FormControl("", Validators.required),
			price: new FormControl(""),
			currency: new FormControl(""),
			rooms: new FormControl("", Validators.required),
			// imagesUrl: new FormControl(""),
			area: new FormControl(""),
			buyRent: new FormControl("",Validators.required),
			garage: new FormControl(false,Validators.required),
			garden: new FormControl(false,Validators.required),
			swimmingPool: new FormControl(false,Validators.required),
			// lon:new FormControl("", Validators.required),
			// lat:new FormControl("", Validators.required),
			additionalInfo:new FormControl(""),
			email : new FormControl(""),
			phone : new FormControl(""),
			name : new FormControl(""),
			company : new FormControl(""),
		})
		this.menu.enable(true);
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Loading,Please wait",
			// duration: 2000
		});
	}

	decrement(){
		if(this.rooms!=null || this.rooms!=0){
			this.rooms--;
		}
	}

	increment(){
		if(this.rooms==10){
			return
		} else {
			this.rooms++;
		}
	}

	ionViewDidLoad() {
		this.getType();
		this.getCountry();
	}

	getType(){
		this.propertySer
		.getPropertyType()
		.subscribe(data =>{
			this.propertyTypes = data;
			console.log("Property Type", this.propertyTypes);
		},err =>{
			console.error(err);
		})
	}

	getCountry(){
		this.propertySer
		.getCountry()
		.subscribe(data =>{
			this.countries = data;
			console.log("Country", this.countries);
		},err =>{
			console.error(err);
		})
	}

	changeType(event){
		console.log(event);
		console.log(this.Type);
	}

	changeCountry(id){
		this.presentLoading();
		this.selectedCountry['country'] = id;
		this.loader.present();
		console.log(this.selectedCountry);
		this.getCountryWiseCity(this.selectedCountry);
		// console.log(this.Type);
	}

	getCountryWiseCity(id){
		this.propertySer
		.getCityByCountry(id)
		.subscribe(data =>{
			console.log("Country Wise City",data);
			this.cities = data;
			this.loader.dismiss();
		},err =>{
			console.error(err);
			this.loader.dismiss();
		})
	}

	changeCity(city){
		this.cityId = city;
		console.log("Function Called", city);
		for(var i=0;i < this.cities.length; i++){
			if(city == this.cities[i]._id){
				this.state = this.cities[i].region;
				break;
			}
		}
	}

	fileChange1(event: any) {
		this.upload = [].slice.call(event.target.files);
		console.log(this.upload);

	}

	create(createProperty){
		this.buttonColor = '#0b7997';
		delete createProperty['email'];
		delete createProperty['name'];
		delete createProperty['phone'];
		delete createProperty['company'];
		createProperty['city'] = this.cityId;
		createProperty['agent'] = this.agentId;
		createProperty['status'] = false;
		console.log("Create Property",createProperty);
		this.propertySer
		.addProperty(createProperty)
		.subscribe(data =>{
			console.log(data);
			let alert = this.alertCtrl.create({
					title: 'Details added successfully!',
					subTitle: 'Now, please place property on map & add images',
					buttons: ['OK']
				});
			alert.present();
			this.navCtrl.push(UploadPropertyImagePage, {'_id':data._id, 'flag':false})
		},err=>{
			console.error(err);
		})
	}

	addCity(){
		this.flag = true;
	}

	cancle(){
		this.flag = false;
		this.newCity = "";
		this.newState = "";
	}

	saveTheCity(){
		this.propertySer.getEnteredCity(this.newCity)
		.subscribe(data =>{
			if(data.status == 202){
				let res = data.json();
				console.log(res.country);
				if(res.country == undefined){
					let newcity = res[0];
					newcity['country'] = this.selectedCountry.country;
					this.updateCity(newcity);
				}
			}else if(data.status == 201){
					let newcity = {name:this.newCity,
									country: this.selectedCountry.country,
									region: this.newState};
					console.log(newcity);
					this.addNewCity(newcity);
			}
		},err =>{
			console.error(err);
		})
	}

	updateCity(city){
		this.propertySer.updateCity(city)
		.subscribe(data =>{
			if(data){
				console.log("update city", data);
				this.selectedCountry.country = data.country;
				this.getCountryWiseCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data._id;
				this.flag = false;
			}
		},err =>{
			console.error(err);
		});
	}

	addNewCity(city){
		this.propertySer.addNewCity(city)
		.subscribe(data =>{
			if(data){
				console.log("update city", data);
				this.selectedCountry.country = data.country;
				this.getCountryWiseCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data._id;
				this.flag = false;
			}
		},err =>{
			console.error(err);
		});
	}

}
