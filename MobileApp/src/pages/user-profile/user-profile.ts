import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform,
		 ModalController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { PropertyProvider } from '../../providers/property/property';
import { UserProvider } from '../../providers/user/user';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UserPropertyPage } from '../user-property/user-property';
import { ExpiringPropertyPage } from '../expiring-property/expiring-property';

@Component({
	selector: 'page-user-profile',
	templateUrl: 'user-profile.html',
})
export class UserProfilePage {
	id;
	user;
	properties;
	city;
	country;
	toast;
	loader;
	constructor(public navCtrl: NavController, public navParams: NavParams,private loadingCtrl: LoadingController,
		private localStorageSer: LocalstorageProvider, private propertySer: PropertyProvider,
		private userSer: UserProvider, private modalCtrl: ModalController, private toastCtrl: ToastController) {
		this.id = this.localStorageSer.getUserId();
		this.presentLoading();
		this.presentToast();
	}

	presentLoading() {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 2000
      });
    }

	presentToast() {
		this.toast = this.toastCtrl.create({
			message: "You don't have posted properties!!",
			duration: 3000,
			position: 'middle'
		});
	}

	ionViewDidLoad() {
		this.getMyDetails(this.id);
	}

	getMyDetails(id){
		this.presentLoading();
		this.loader.present();
		this.userSer
		.getUser(id)
		.subscribe(data =>{
			console.log(data);
			this.user = data;
			this.getCountry();
		},err =>{
			console.error(err);
			this.loader.dismiss();
		})
	}

	getCountry(){
		this.propertySer
		.getCountry()
		.subscribe(data =>{
			for(var i=0; i<data.length;i++){
				if(this.user.country == data[i]._id){
					this.country = data[i];
					console.log(this.country);
					let Country={country:this.country._id};
					this.getCity(Country);
				}
			}
		},err =>{
			console.error(err);
		})
	}

	getCity(id){
		this.presentLoading();
		this.propertySer
		.getCityByCountry(id)
		.subscribe(data =>{
			console.log(data);
			for(var i=0; i<data.length;i++){
				if(this.user.city == data[i]._id){
					this.city = data[i]
					console.log(this.city);
				}
			}
			this.loader.dismiss();
		},err =>{
			console.error(err);
		})
	}

	getMyProperties(){
		if(this.user.propertyCount>0){
			this.navCtrl.push(UserPropertyPage, {'id':this.id})
		}else{
			this.toast.present(this.toast);
		}
	}

	getExpiringProperties(){
		this.navCtrl.push(ExpiringPropertyPage)
	}

	updateUserDetail(user){
		console.log("user", user);
		let modal = this.modalCtrl.create(UpdateUser, {'user':user});
		modal.onDidDismiss(data => {
			console.log(data);
			if(data.updateFlag == true)
				this.getMyDetails(this.id);
		})
		modal.present();
	}

}


@Component({
	selector: 'page-update-profile',
	templateUrl: 'update-profile.html',
})

export class UpdateUser{
	user;
	country;
	city;
	countries;
	countryId;
	selectedCountry={};
	cities;
	cityId;
	loader;
	constructor(public platform: Platform,
		public params: NavParams,
		private propertySer: PropertyProvider,
		public viewCtrl: ViewController,
		private userSer: UserProvider,
		private alertCtrl: AlertController,
		private loadingCtrl: LoadingController){

		this.presentLoading();
		this.user = this.params.get('user');
		console.log(this.user);
		this.cityId = this.user.city;//._id
		this.countryId = this.user.country;//._id
		console.log(this.countryId);
		this.selectedCountry['country']=this.countryId;
		this.getCountryWiseCity(this.selectedCountry);

		this.city = this.user.city;//._id
		console.log(this.city);
		this.getCountry();
	}

	presentLoading() {
      this.loader = this.loadingCtrl.create({
        content: "Loading! Please wait",
        duration: 2000
      });
    }

	getCountry(){
		this.userSer
		.getWorldCountries()
		.subscribe(data =>{
			this.countries = data;
			console.log("Country", this.countries);
		},err =>{
			console.error(err);
		})
	}
	changeCountry(id){
		console.log(id);
		this.countryId = id;
		this.selectedCountry['country'] = id;
		this.getCountryWiseCity(this.selectedCountry);
		// console.log(this.Type);
	}

	getCountryWiseCity(id){
		console.log("City Id", id);
		this.userSer
		.getCountryWiseWorldCities(id)
		.subscribe(data =>{
			console.log("Country Wise City",data);
			this.cities = data;
		},err =>{
			console.error(err);
		})
	}

	changeCity(city){
		console.log(city);
		this.cityId = city;
		// for(var i=0;i<this.cities.length;i++){
		// 	if(city === this.cities[i]._id){
		// 		this.user.state = this.cities[i].region;
		// 	}
		// }
	}

	update(user){
		this.loader.present();
		console.log("Updated", user);
		user['city']=this.cityId;
		user['country'] = this.countryId;
		this.userSer
		.updateUser(user)
		.subscribe(data =>{
			setTimeout(()=>{
			let alert = this.alertCtrl.create({
				title: 'Success!',
				subTitle: 'User details Updated Successfully!',
				buttons: ['OK']
			});
			alert.present();
				// alert.dismiss();
			},2000)
			this.loader.dismiss();
			this.viewCtrl.dismiss({updateFlag: true});
		},err =>{
			console.error(err);
			this.loader.dismiss();
		})

	}

	dismiss() {
		this.viewCtrl.dismiss({updateFlag: false});
	}
}
