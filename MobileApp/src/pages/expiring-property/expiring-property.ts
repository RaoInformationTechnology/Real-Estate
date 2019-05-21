import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UtilityProvider } from '../../providers/utility/utility';
import { PropertyDetailsPage } from '../property-details/property-details';

@Component({
	selector: 'page-expiring-property',
	templateUrl: 'expiring-property.html',
})
export class ExpiringPropertyPage {
	userId;
	expiringProperties=[];
	loader;
	image_url;
	date=[];
	expiryDate=[];
	propertyCount;
	count=0;
	finishInfiniteScroll:boolean = true;
	toast;
	j=0;
	constructor(public navCtrl: NavController, public navParams: NavParams, private _utility: UtilityProvider,
		private _propertySer: PropertyProvider, private _localStorage: LocalstorageProvider,
		private alertCtrl: AlertController,private loadingCtrl: LoadingController,private toastCtrl: ToastController){
		this.userId = this._localStorage.getUserId();
		// this.presentLoading();
		this.presentToast();
		this.image_url = this._utility.getImageUrl();
	}

	ionViewDidLoad() {
		this.getExpiringPropertyCount(this.userId);
		this.getExpiringProperty(this.userId, this.count);
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
        content: "Please wait...",
        // duration: 2000
      });
    }

    getExpiringPropertyCount(id){
    	this._propertySer.getAgentWisePropertyCount(id)
    	.subscribe(data=>{
    		this.propertyCount = data;
    	},err=>{
    		console.error(err);
    	})
    }

	getExpiringProperty(id, count){
		this.presentLoading();
		this.loader.present();
		this._propertySer
		.getExpiringProperties(id, count)
		.subscribe(data =>{
			console.log("expiringProperties", data);
			for(var i=0; i<data.length;i++){
			this.expiringProperties.push(data[i]);
			this.date.push(new Date(data[i].createdAt));
			this.expiryDate.push(new Date(this.date[this.j].getFullYear(),this.date[this.j].getMonth(),this.date[this.j].getDate()+90).toDateString());
			this.expiringProperties[this.j].expireAt = this.expiryDate[this.j];
			this.j++;
			// console.log(this.expiringProperties[i]);
			}
			this.loader.dismiss();
		},err =>{
			console.error(err);
			this.loader.dismiss();
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Something went wrong!!',
				buttons: ['OK']
			});
			alert.present();
		})
	}

	doInfinite(infiniteScroll) {
		if(this.expiringProperties.length<this.propertyCount){
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
				this.getExpiringProperty(this.userId, this.count);
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

	sendRequest(id){
		let credentials={'agent_id':this.userId, 'property_id':id};
		this.presentLoading();
		this.loader.present();
		this._propertySer
		.renewProperty(credentials)
		.subscribe(data =>{
			this.loader.dismiss();
			console.log("Responce of request", data);
			let alert = this.alertCtrl.create({
				title: 'Success!',
				subTitle: 'Property renewal request sent successfully',
				buttons: ['OK']
			});
			alert.present();
			this.getExpiringProperty(this.userId, 0);
		},err =>{
			console.error(err);
			this.loader.dismiss();
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Something went wrong. Please try again later!',
				buttons: ['OK']
			});
			alert.present();
		})
	}

	deleteProperty(id){
		this.presentLoading();
		this.loader.present();
		this._propertySer
		.deleteProperty(id)
		.subscribe(data =>{
			console.log(data);
			let alert = this.alertCtrl.create({
				title: 'Success!',
				subTitle: 'Your property is deleted successfully.',
				buttons: ['OK']
			});
			alert.present();
			this.getExpiringProperty(this.userId, 0);
			this.loader.dismiss();
		},err =>{
			this.loader.dismiss();
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Something went wrong. Please try again later!',
				buttons: ['OK']
			});
			alert.present();
		})
	}

	propertyDetails(property){
      console.log("selected Property", property);
      this.navCtrl.push(PropertyDetailsPage, {'selectedProperty': property._id});
    }

}
