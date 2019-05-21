import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';

@Component({
	selector: 'page-update-property',
	templateUrl: 'update-property.html',
})
export class UpdatePropertyPage {
	property;
	propertyType;
	propertyTypeID;
	country;
	city;
	countries;
	countryId;
	selectedCountry={};
	cities;
	cityId;
	loader;
	headerFlag;
	headerName;
	constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController,
		private _propertySer: PropertyProvider, private loadingCtrl: LoadingController) {
		this.property = this.navParams.get('data');
		this.headerFlag = this.navParams.get('flag');
		if(this.headerFlag){
			this.headerName = 'Update';
		}else if(!this.headerFlag){
			this.headerName = 'Confirm';
		}
		console.log("Property to Update", this.property);
		this.presentLoading();
		this.propertyTypeID = this.property.propertyType._id;
		this.countryId = this.property.country._id;
		this.selectedCountry['country'] = this.countryId;
		this.getCountryWiseCity(this.selectedCountry);
		this.cityId = this.property.city._id;
	}

	ionViewDidLoad() {
		this.getType();
		this.getCountry();
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
			// duration: 2000
		});
	}

	getType(){
		this._propertySer
		.getPropertyType()
		.subscribe(data =>{
			this.propertyType = data;
			console.log("Property Type", this.propertyType);
		},err =>{
			console.error(err);
		})
	}
	changeType(event){
		console.log(event);
	}

	getCountry(){
		this._propertySer
		.getCountry()
		.subscribe(data =>{
			this.countries = data;
			console.log("Country", this.countries);
		},err =>{
			console.error(err);
		})
	}

	changeCountry(id){
		this.presentLoading();
		console.log(id);
		this.countryId = id;
		this.loader.present();
		this.selectedCountry['country'] = id;
		this.getCountryWiseCity(this.selectedCountry);
		// console.log(this.Type);
	}

	changeCurrency(currency){
		console.log(currency);
	}


	getCountryWiseCity(id){
		this.loader.present();
		console.log("City Id", id);
		this._propertySer
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
		console.log(city);
		this.cityId = city;
		for(var i=0;i<this.cities.length;i++){
			if(city === this.cities[i]._id){
				this.property.state = this.cities[i].region;
			}
		}
	}

	update(property){
		property['propertyType'] = this.propertyTypeID;
		property['country'] = this.countryId;
		property['city'] = this.cityId;
		console.log("Updated property",property);
		this._propertySer
		.updateProperty(property)
		.subscribe(data =>{
			console.log("property updated successFully!!");
			let alert = this.alertCtrl.create({
					title: 'Success!',
					subTitle: 'Property details updated successfully!',
					buttons: ['OK']
				});
			alert.present();
			this.navCtrl.pop();
		},err =>{
			console.error(err);
		})
	}

}
