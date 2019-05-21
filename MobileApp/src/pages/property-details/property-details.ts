import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { UtilityProvider } from '../../providers/utility/utility';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UpdatePropertyPage } from '../update-property/update-property';
import { UploadPropertyImagePage } from '../upload-property-image/upload-property-image';
import * as $ from 'jquery';

@Component({
	selector: 'page-property-details',
	templateUrl: 'property-details.html',
})
export class PropertyDetailsPage {
	propertyid;
	property;
	segments : string = "property";
	agent;
	user;
	city;
	country;
	image_url;
	userType;
	date;
	expiryDate;
	day;
	month;
	year;
	dates;
	PublicationDate;
	constructor(public navCtrl: NavController, private propertySer: PropertyProvider, public navParams: NavParams,
		private utilitySer: UtilityProvider, private _localStorage: LocalstorageProvider) {
		this.propertyid = this.navParams.get('selectedProperty');
		console.log(this.propertyid);
		this.image_url = this.utilitySer.getImageUrl();
	}

	ionViewDidEnter() {
		this.user = this._localStorage.getUser();
		this.userType = this._localStorage.getUserType();
		console.log(this.userType);
		this.getPropertyDetails(this.propertyid)
	}

	getPropertyDetails(id){
		this.propertySer
		.getProperty(id)
		.subscribe(data =>{
			this.property = data[0];
			this.agent = this.property.agent;
			this.date = new Date(this.property.createdAt);
			// this.day = new Date(this.date.getFullYear() ,this.date.getMonth(),this.date.getDate()+90).toLocaleString('en-us', {  weekday: 'long' });
			this.expiryDate = new Date(this.date.getFullYear() ,this.date.getMonth(),this.date.getDate()+90).toDateString();			
			// this.dates = this.expiryDate.getDate();
			// this.year = this.expiryDate.getFullYear();
			const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
			];
			// this.month = monthNames[this.expiryDate.getMonth()];
			this.PublicationDate = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate()).toDateString();
		},err =>{
			console.error(err);
		})
	}

	updataProperty(property){
		this.navCtrl.push(UpdatePropertyPage, {data: property, flag:true});
	}

	updateImage(id){
		this.navCtrl.push(UploadPropertyImagePage, {'_id':id, flag:true})
	}

}
