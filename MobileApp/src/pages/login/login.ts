import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController, Events, LoadingController,
		ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { LoginProvider } from '../../providers/login/login';
import { MyApp } from '../../app/app.component';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	buttonColor: string = '#0b7997';
	user={email: "", password: ""};
	loader;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		private loginSer: LoginProvider, private alertCtrl: AlertController,
		private menu: MenuController, public event: Events, private localStorageService: LocalstorageProvider,
		private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
	}
	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Please wait...",
			// duration: 2000
		});
	}

	doLogin(){
		this.buttonColor = '#0b7997';
		console.log(this.user);
		// this.navCtrl.setRoot(HomePage);
		this.presentLoading();
		this.loader.present();
		this.loginSer
		.login(this.user)
		.subscribe(data =>{
			console.log(data);
			if (data.user != undefined) {
				let toast = this.toastCtrl.create({
					message: "You have successfully logged in!",
					duration: 3000,
					showCloseButton: true,
					closeButtonText: "Ok"
				});
				toast.present();
				localStorage.setItem('user', JSON.stringify(data.user));
				localStorage.setItem('token', JSON.stringify(data.token));
				let date = new Date().toDateString()
				console.log(date);
				this.localStorageService.setUserLastSessionTime(date);
				console.log("user", data.user);
				this.menu.enable(true);
				this.event.publish('user:login');
				this.navCtrl.setRoot(MyApp);
				this.loader.dismiss();
			}else if(data.admin != undefined){
				let alert = this.alertCtrl.create({
					title: 'Error!',
					subTitle: 'Incorrect Username or Password',
					buttons: ['OK']
				});
				this.loader.dismiss();
				alert.present();
				this.user = {email: '', password: ''};
				console.log(this.user);
			}
			else{
				this.loader.dismiss();
				this.user = {email: '', password: ''};
				console.log(this.user);
			}
		},err=>{
			this.loader.dismiss();
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Incorrect Username or Password',
				buttons: ['OK']
			});
			alert.present();
		})
	}

	dosignup(){
		this.buttonColor = '#0b7997';
		this.navCtrl.push(SignupPage)
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad LoginPage');
	}

}