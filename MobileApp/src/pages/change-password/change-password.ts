import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';
import { UserProvider } from '../../providers/user/user';

@Component({
	selector: 'page-change-password',
	templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
	useremail;
	oldPassword;
	newPassword;
	confirmNewPassword;
	constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController,
		private localStorageSer: LocalstorageProvider, private userSer: UserProvider) {
		this.useremail = this.localStorageSer.getUserEmail();
		console.log(this.useremail);
	}

	ionViewDidLoad() {

	}

	changePassword(){
		if(this.newPassword === this.confirmNewPassword){
			let user = {email:this.useremail,
						password:this.oldPassword,
						newPassword: this.newPassword};
			console.log("user", user);
			this.userSer.changePassword(user)
			.subscribe(data =>{
				console.log("password changed");
				let alert = this.alertCtrl.create({
					title: 'Success!',
					subTitle: 'Password changed successfully!',
					buttons: ['OK']
				});
			alert.present();
				this.navCtrl.pop();
			},err =>{
				console.error(err);
			})
		}else{
			console.log("error");
		}
	}

	cancle(){
		this.navCtrl.pop();
	}

}
