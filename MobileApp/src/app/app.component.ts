import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Nav, Platform, MenuController, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AddListingPage } from '../pages/add-listing/add-listing';
import { LogoutPage } from '../pages/logout/logout';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { LocalstorageProvider } from '../providers/localstorage/localstorage';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ExpiringPropertyPage } from '../pages/expiring-property/expiring-property';
import { SettingsPage } from '../pages/settings/settings';
import { UserPropertyPage } from '../pages/user-property/user-property';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  userType;
  agentPages = [{ title: 'New Search', component: HomePage },
        { title: 'Add Listing', component: AddListingPage },
        { title: 'My Properties', component: UserPropertyPage },
        { title: 'Expiring Properties', component: ExpiringPropertyPage },
        { title: 'Settings', component: SettingsPage },
        { title: 'About SamsarCom', component: AboutUsPage },
        { title: 'Logout', component: LogoutPage }];
  blockUserPages = [{ title: 'New Search', component: HomePage },
  { title: 'My Properties', component: UserPropertyPage },
  { title: 'Settings', component: SettingsPage },
  { title: 'About SamsarCom', component: AboutUsPage },
  { title: 'Logout', component: LogoutPage }];
  guestPages = [{ title: 'New Search', component: HomePage },
  { title: 'About SamsarCom', component: AboutUsPage }];
  name;
  toast;
  internetDisCon;
  internetCon;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private menu: MenuController, private localStorageSer: LocalstorageProvider, public events: Events,
    private changeRef: ChangeDetectorRef, private network: Network, private toastCtrl: ToastController) {
    this.initializeApp();
    this.menu.enable(true, 'menu1');
    
  }

  listenToLoginEvents() {
    console.log("listenToLoginEvents() called");
    this.events.subscribe('user:login', () => {
      this.userType = this.localStorageSer.getUserType();
      console.log("User Type ======", this.userType, " ========");
      this.rootPage = HomePage;

      if (this.userType == 'Agent') {
        this.name = this.localStorageSer.getUserName();
      }else if(this.userType == 'BlockedAgent'){
        this.name = this.localStorageSer.getUserName();
      }
    });

    this.events.subscribe('user:logout', () => {
      this.userType = this.localStorageSer.getUserType();
      let toast = this.toastCtrl.create({
        message: "Logged out successfully!",
        duration: 3000,
        showCloseButton: true,
        closeButtonText: "Ok"
      });
      toast.present();
      if(this.userType == 'Guest'){
        if(localStorage.getItem('defaultsearch')){
          localStorage.removeItem('defaultsearch');
        }
        this.rootPage = HomePage;
        this.name = 'Guest';
      }
    });
  }

  presentToast() {
    this.toast = this.toastCtrl.create({
      message: "Your session has expired!! please login again!!",
      duration: 3000,
      position: 'bottom'
    });
  }

  // internetDisConToast() {
  //   this.internetDisCon = this.toastCtrl.create({
  //     message: "Your have no Internet Connection!! Please turn on internet or WiFi !!",
  //     // duration: 3000,
  //     position: 'center',
  //      showCloseButton: true,
  //       closeButtonText: "Ok"
  //   });
  // }

  // internetConToast() {
  //   this.internetCon = this.toastCtrl.create({
  //     message: "Now you are connectd to Internet!!",
  //     // duration: 3000,
  //     position: 'center',
  //      showCloseButton: true,
  //       closeButtonText: "Ok"
  //   });
  // }



  initializeApp() {
    this.platform.ready().then(() => {
      this.presentToast();
       // this.internetDisConToast();
       // this.internetConToast();
      console.log("initializeApp() called");
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.listenToLoginEvents();



      // console.log("Internet Connection");
      // console.log(this.network.onConnect());
      // let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      //   console.log('network was disconnected :-(');
      //   this.internetDisCon.present(this.internetDisCon);
      // });
      // console.log(disconnectSubscription);
      // // disconnectSubscription.unsubscribe();

      // let connectSubscription = this.network.onConnect().subscribe(() => {
      //   console.log('network connected!');
      //   this.internetCon.present(this.internetCon);
      // });
      // console.log(connectSubscription);
      // // connectSubscription.unsubscribe();

        let sessionDate = this.localStorageSer.getUserLastSessionTime();
        console.log(sessionDate);
        if (sessionDate == undefined ) {
          // this.toast.present(this.toast);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('userSession');
          this.userType = this.localStorageSer.getUserType();
          this.name = 'Guest';
          this.rootPage = HomePage;
        }else{
          var date1 = new Date(sessionDate);
          var date2 = new Date();
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
          if(diffDays > 7){
            this.toast.present(this.toast);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userSession');
            this.userType = this.localStorageSer.getUserType();
            console.log("User Type ======", this.userType, " ========");
            if(this.userType == 'Guest'){
              if(localStorage.getItem('defaultsearch')){
                localStorage.removeItem('defaultsearch');
              }
              this.rootPage = HomePage;
              this.name = 'Guest';
            }
          }else{
            this.userType = this.localStorageSer.getUserType();
            console.log("User Type ======", this.userType, " ========");

            if (this.userType == 'Agent') {
              this.rootPage = HomePage;
              this.name = this.localStorageSer.getUserName();
            }else if(this.userType == 'BlockedAgent'){
              this.rootPage = HomePage;
              this.name = this.localStorageSer.getUserName();
            }else if(this.userType == 'Guest'){
              if(localStorage.getItem('defaultsearch')){
                localStorage.removeItem('defaultsearch');
              }
              this.rootPage = HomePage;
              this.name = 'Guest';
            }
          }
        }

    });
  }

  openPage(page) {
      if(localStorage.getItem('properties'))
        localStorage.removeItem('properties');
      if(localStorage.getItem('query'))
        localStorage.removeItem('query');
      console.log(page.component);
      console.log(this.nav.getActive().component);
      if(page.component != this.nav.getActive().component){
        if(page.component == HomePage){
          this.nav.setRoot(page.component);
        }else if(page.component == UserPropertyPage){
          let userId = this.localStorageSer.getUserId();
          console.log(userId);
          this.nav.push(page.component, {'id':userId});
        }else{
          this.nav.push(page.component);
        }
      }
  }

  myProfile(){
    if(localStorage.getItem('user')){
      this.menu.toggle();
      this.nav.push(UserProfilePage);
    } else {
      this.nav.push(LoginPage);
      this.menu.toggle();
    }
  }
}
