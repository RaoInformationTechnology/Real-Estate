import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import * as $ from 'jquery';

@Component({
	selector: 'page-signup-authentication',
	templateUrl: 'signup-authentication.html',
})
export class SignupAuthenticationPage {
	randomCode;
	user;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		private userSer: UserProvider, private alertCtrl: AlertController) {
		this.user = this.navParams.get('user');
		console.log(this.user);
	}

	ionViewDidLoad() {
		setTimeout(()=>{
			document.getElementById('newCode').innerHTML = "Your key has been expired click here to get new one";
			$('#code').css('display', 'none');
		}, 300000);
	}

	getNewCode(){
		console.log("Func called");
		let user = {_id:this.user._id}
		this.userSer
		.getNewVerificationCode(user)
		.subscribe(data =>{
			console.log("New Code",data);
			$('#code').css('display', 'block');
			$('#newCode').css('display', 'none');
			this.ionViewDidLoad();
		},err =>{
			console.error(err);
		})
	}

	verify(){
		let user = {_id:this.user._id,
		randomCode: this.randomCode};
		if (user.randomCode != "" && user.randomCode != undefined) {
			this.userSer
			.verifyUser(user)
			.subscribe(data =>{
				console.log("Verification:", data);
				this.navCtrl.popTo(LoginPage)
			},err =>{
				console.error(err);
				if(err.status === 401){
					let alert = this.alertCtrl.create({
						title: 'Error',
						subTitle: 'Your verification code has expired!',
						buttons: ['OK']
					});
					alert.present();
				}
				if(err.status === 400){
					let alert = this.alertCtrl.create({
						title: 'Error',
						subTitle: 'Your verification code is incorrect!',
						buttons: ['OK']
					});
					alert.present();
				}
			});
		} else {
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Please enter verification code',
				buttons: ['OK']
			});
			alert.present();
		}
	}
}
