import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { PropertyDetailsPage } from '../property-details/property-details';
import { UtilityProvider } from '../../providers/utility/utility';

@Component({
	selector: 'page-user-property',
	templateUrl: 'user-property.html',
})
export class UserPropertyPage {
	properties=[];
	id;
	loader;
	image_url;
	allProperty=[];
	j;
	k;
	toast;
	finishInfiniteScroll:boolean=true;
	propertyCount;
	count=0;
	constructor(public navCtrl: NavController, public navParams: NavParams, private _utility: UtilityProvider,
		private propertySer: PropertyProvider, private loadingCtrl: LoadingController,
		private toastCtrl: ToastController) {
		this.id = this.navParams.get('id');
		this.presentLoading();
		this.presentToast();
		this.image_url = this._utility.getImageUrl();
	}

	presentToast() {
		this.toast = this.toastCtrl.create({
			message: "No more properties found",
			duration: 3000,
			position: 'bottom'
		});
	}

	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Loading! Please wait",
			// duration: 2000
		});
	}

	ionViewDidLoad() {
		this.getUserPropertyCount(this.id);
		this.getMyProperties(this.id, this.count);
	}

	getUserPropertyCount(id){
		this.propertySer.getAgentWisePropertyCount(id)
		.subscribe(data =>{
			this.propertyCount = data;
			console.log("count", this.propertyCount);
		},err =>{
			console.error(err);
		})
	}

	getMyProperties(id, count){
		this.presentLoading();
		this.loader.present();
		this.propertySer
		.getAgentWiseProperty(id, count)
		.subscribe(data =>{
			console.log(data);
			for(var i=0; i < data.length; i++){
				this.allProperty.push(data[i]);
			}
			// for(var i=0; i < 15; i++){
			// 	this.properties[i] = data[i];
			// 	this.j = i;
			// 	this.k=i;
			// 	if(i == data.length)
			// 		break;
			// }
			this.loader.dismiss();
		},err =>{
			console.error(err);
			this.loader.dismiss();
		})
	}
	doInfinite(infiniteScroll) {
		if(this.allProperty.length<this.propertyCount){
			console.log('Begin async operation');
			setTimeout(() => {
				this.count=this.count+1;
				// this.k += 15;
				// console.log("K is:", this.k);
				// for (var i = this.j; i < this.k; i++) {
				// 	if(i == this.allProperty.length){
				// 		break;
				// 	}
				// 	this.properties[i] = this.allProperty[i];
				// 	this.j = i;
				// }

				// console.log('Async operation has ended');
				this.getMyProperties(this.id, this.count);
				infiniteScroll.complete();
				this.finishInfiniteScroll = true;
			}, 500);
		} else {
			console.log('Begin async operation');
			setTimeout(() => {
				console.log('Async operation has ended');
				infiniteScroll.complete();
				this.finishInfiniteScroll=false;
				this.toast.present(this.toast);
			}, 500);
		}
	}

	propertyDetails(property){
		console.log("selected Property", property);
		this.navCtrl.push(PropertyDetailsPage, {'selectedProperty': property._id});
	}

}
