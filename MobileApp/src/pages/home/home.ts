import { Component } from '@angular/core';
import { NavController, MenuController, Events, AlertController,
	ToastController, LoadingController } from 'ionic-angular';
import { AddListingPage } from '../../pages/add-listing/add-listing';
import { LoginPage } from '../login/login';
import { SearchResultPage } from '../../pages/search-result/search-result';
import { PropertyProvider } from '../../providers/property/property';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
// declare var $: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	buttonColor: string = '#0b7997';
	propertyType;
	Type;
	countryId;
	buyRent='Buy';
	selectedCountry={city:""};
	countries;
	cities;
	city;
	searchQuery={'buyRent':"",
	'propertyType':"",
	'country':"",
	'city':""};
	userType;
	loader;
	constructor(public navCtrl: NavController, private menu: MenuController, private events: Events,
		private propertySer: PropertyProvider, private localStorageService: LocalstorageProvider,
		private alertCtrl: AlertController, private toastCtrl: ToastController,
		private network: Network, private loadingCtrl: LoadingController) {
		this.userType = this.localStorageService.getUserType();
		console.log(this.userType);
		// this.ionViewDidLoad();
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
			// duration: 2000
		});
	}

	ionViewDidLoad() {
	
	}

	ionViewDidEnter(){
		this.buyRent="Buy";
		this.Type="";
		this.countryId="";
		this.city="";
		if (localStorage.getItem('defaultsearch')) {
			this.searchQuery = JSON.parse(localStorage.getItem('defaultsearch'));
			this.buyRent = this.searchQuery['buyRent'];
			this.setOption(this.buyRent);
			this.Type = this.searchQuery['propertyType'];
			this.countryId = this.searchQuery['country'];
			this.city = this.searchQuery['city'];
			this.selectedCountry['country'] = this.searchQuery['country'];
			this.presentLoading();
			this.loader.present();
			this.getCountryWiseCity(this.selectedCountry);
		}else{
			$('#buy').css({
				"background-color" : "#0b7997",
				"color": "white",
				"font-weight": "700"
			});
		}

		this.getType();
		this.getCountry();

		console.log("Internet Connection");
		console.log(this.network.onConnect());
		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
			console.log('network was disconnected :-(');
			let internetDisCon = this.toastCtrl.create({
				message: "You have no Internet Connection!! Please turn on Data or connect to WiFi!",
				duration: 3000,
				position: 'center',
				showCloseButton: true,
				closeButtonText: "Ok"
			});
			internetDisCon.present();
		});
		console.log(disconnectSubscription);
      // disconnectSubscription.unsubscribe();

      let connectSubscription = this.network.onConnect().subscribe(() => {
      	console.log('network connected!');
      	let internetCon = this.toastCtrl.create({
			message: "You are connectd to Internet!",
			duration: 3000,
			position: 'center',
			showCloseButton: true,
			closeButtonText: "Ok"
		});
		internetCon.present();
      	this.getType();
		this.getCountry();
      });
      console.log(connectSubscription);
	}

	setOption(option){
		if(option === 'Buy'){
			this.buyRent = 'Buy';
			$('#buy').css({
				"background-color" : "#0b7997",
				"color": "white",
				"font-weight": "700"
			});
			$('#rent').css({
				"background-color" : "white",
				"color": "black",
				"font-weight": "400"
			});
		}
		else if(option === 'Rent'){
			this.buyRent = 'Rent';
			$('#rent').css({
				"background-color" : "#0b7997",
				"color": "white",
				"font-weight": "700"
			});
			$('#buy').css({
				"background-color" : "white",
				"color": "black",
				"font-weight": "400"
			});
		}
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
		console.log(event);
	}

	changeCountry(id){
		this.presentLoading();
		console.log(id);
		if(this.countryId != "" && this.countryId != undefined){
			this.loader.present();
			this.selectedCountry['country'] = id;
			this.getCountryWiseCity(this.selectedCountry);
		}
		// console.log(this.Type);
	}

	changeCity(city){
		console.log(city);
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


	addListing(){
		this.buttonColor = '#0b7997';
		this.navCtrl.push(AddListingPage);
	// this.navCtrl.setRoot(AddListingPage);
	
	}

	login(){
		this.buttonColor = '#0b7997';
		// this.navCtrl.push(LoginPage);
	this.navCtrl.push(LoginPage);
	}

	searchProperty(){
		this.buttonColor = '#0b7997';
		this.searchQuery['buyRent']=this.buyRent;
		this.searchQuery['propertyType']=this.Type;
		this.searchQuery['country']=this.countryId;
		this.searchQuery['city']=this.city;
		if(this.searchQuery.buyRent != "" && this.searchQuery.city != ""
			&& this.searchQuery.country != "" && this.searchQuery.propertyType != ""){
			this.navCtrl.setRoot(SearchResultPage, {'searchOptions': this.searchQuery});
		}else if(localStorage.getItem('defaultsearch')){
			this.searchQuery = JSON.parse(localStorage.getItem('defaultsearch'));
			this.navCtrl.setRoot(SearchResultPage, {'searchOptions': this.searchQuery});
		} else{
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Please select all the fields',
				buttons: ['OK']
			});
			alert.present();
		}
	}

}
