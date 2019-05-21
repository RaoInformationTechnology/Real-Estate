import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { HomePage } from '../home/home';

@Component({
	selector: 'page-logout',
	templateUrl: 'logout.html',
})
export class LogoutPage {

	constructor(public navCtrl: NavController, public navParams: NavParams,
				private menu: MenuController, public event: Events) {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		localStorage.removeItem('userSession');
		this.event.publish('user:logout');
		this.navCtrl.setRoot(MyApp);
	}

	ionViewDidLoad() {
	}

}
