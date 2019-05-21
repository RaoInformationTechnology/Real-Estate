import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SetDefaultSearchPage } from '../set-default-search/set-default-search';
import { ChangePasswordPage } from '../change-password/change-password';
import { SetDefaultLanguagePage } from '../set-default-language/set-default-language';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  defaultOption(option){
    if(option == 'Search')
    	this.navCtrl.push(SetDefaultSearchPage);
    else if(option == 'Language')
      this.navCtrl.push(SetDefaultLanguagePage);
    else if(option == 'Password')
      this.navCtrl.push(ChangePasswordPage);
  }
}
