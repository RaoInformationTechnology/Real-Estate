import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { HomePage } from '../home/home';
import * as $ from 'jquery';

@Component({
	selector: 'page-set-default-search',
	templateUrl: 'set-default-search.html',
})
export class SetDefaultSearchPage {
	buttonColor: string = '#0b7997';
	propertyType;
	Type;
	countryId;
	buyRent;
	selectedCountry={city:""};
	countries;
	cities;
	city;
	flag:boolean=false;
	searchQuery={'buyRent':"",
	'propertyType':"",
	'country':"",
	'city':""};
	loader;
	constructor(public navCtrl: NavController, private toastCtrl: ToastController, public navParams: NavParams,
		private propertySer: PropertyProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
			// duration: 2000
		});
	}

	ionViewDidLoad() {
		if (localStorage.getItem('defaultsearch')) {
			this.flag=true;
			this.searchQuery = JSON.parse(localStorage.getItem('defaultsearch'));
			this.buyRent = this.searchQuery['buyRent'];
			this.Type = this.searchQuery['propertyType'];
			this.countryId = this.searchQuery['country'];
			this.city = this.searchQuery['city'];
			this.selectedCountry['country'] = this.searchQuery['country'];
			this.presentLoading();
			this.loader.present();
			this.getCountryWiseCity(this.selectedCountry);
		}
		this.getType();
		this.getCountry();
	}

	getType(){
		this.propertySer
		.getPropertyType()
		.subscribe(data =>{
			this.propertyType = data;
			console.log("Property Type", this.propertyType);
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
		this.Type=event;
		console.log(this.Type);
	}

	changeBuyRent(event){
		this.buyRent = event;
		console.log(this.buyRent);
	}

	changeCountry(id){
		this.presentLoading();
		this.countryId=id;
		console.log(this.countryId);
		if(this.countryId != "" && this.countryId != undefined){
			this.loader.present();
			this.selectedCountry['country'] = this.countryId;
			this.getCountryWiseCity(this.selectedCountry);
		}
		// console.log(this.Type);
	}

	changeCity(city){
		this.city = city;
		console.log(this.city);
	}

	getCountryWiseCity(id){
		console.log("City Id", id);
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

	setSearch(){
		this.buttonColor = '#0b7997';
		this.searchQuery['buyRent']=this.buyRent;
		this.searchQuery['propertyType']=this.Type;
		this.searchQuery['country']=this.countryId;
		this.searchQuery['city']=this.city;
		console.log(this.searchQuery);
		if(this.searchQuery.buyRent != undefined && this.searchQuery.city != undefined
			&& this.searchQuery.country != undefined && this.searchQuery.propertyType != undefined){
			localStorage.setItem('defaultsearch', JSON.stringify(this.searchQuery))
			this.flag=true;
			let saveToast = this.toastCtrl.create({
			message: "Your default search settings has been saved!",
			duration: 3000,
			position: 'center'
			// showCloseButton: true,
			// closeButtonText: "Ok"
		});
		saveToast.present();
			this.navCtrl.setRoot(HomePage)
		}else{
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Please select all the fields',
				buttons: ['OK']
			});
			alert.present();
		}
	}

	clearSearch(){
		localStorage.removeItem('defaultsearch');
		this.buyRent="";
		this.Type="";
		this.countryId="";
		this.city="";
		this.propertyType=[];
		this.countries=[];
		this.cities=[];
		this.flag=false;
		let clearToast = this.toastCtrl.create({
			message: "Your default search settings has been cleared!",
			duration: 3000,
			position: 'center'
			// showCloseButton: true,
			// closeButtonText: "Ok"
		});
		clearToast.present();
		this.ionViewDidLoad();
	}

	Cancle(){
		this.navCtrl.pop();
	}
}
