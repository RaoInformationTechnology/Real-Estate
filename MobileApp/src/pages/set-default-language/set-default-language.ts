import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-set-default-language',
  templateUrl: 'set-default-language.html',
})
export class SetDefaultLanguagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetDefaultLanguagePage');
  }

}
