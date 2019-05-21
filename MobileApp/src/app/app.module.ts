import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { GoogleMaps } from '@ionic-native/google-maps';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { AgmCoreModule } from '@agm/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AddListingPage } from '../pages/add-listing/add-listing';
import { SearchResultPage, Filter } from '../pages/search-result/search-result';
import { LogoutPage } from '../pages/logout/logout';
import { UserProfilePage, UpdateUser } from '../pages/user-profile/user-profile';
import { PropertyDetailsPage } from '../pages/property-details/property-details';
import { SettingsPage } from '../pages/settings/settings';
import { SignupAuthenticationPage } from '../pages/signup-authentication/signup-authentication';
import { UserPropertyPage } from '../pages/user-property/user-property';
import { UploadPropertyImagePage } from '../pages/upload-property-image/upload-property-image';
import { UpdatePropertyPage } from '../pages/update-property/update-property';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ExpiringPropertyPage } from '../pages/expiring-property/expiring-property';
import { SetDefaultSearchPage } from '../pages/set-default-search/set-default-search';
import { ChangePasswordPage } from '../pages/change-password/change-password'
import { SetDefaultLanguagePage } from '../pages/set-default-language/set-default-language';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginProvider } from '../providers/login/login';
import { UtilityProvider } from '../providers/utility/utility';
import { UserProvider } from '../providers/user/user';
import { PropertyProvider } from '../providers/property/property';
import { LocalstorageProvider } from '../providers/localstorage/localstorage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    AddListingPage,
    SearchResultPage,
    LogoutPage,
    UserProfilePage,
    UpdateUser,
    Filter,
    PropertyDetailsPage,
    SettingsPage,
    SignupAuthenticationPage,
    UserPropertyPage,
    UploadPropertyImagePage,
    UpdatePropertyPage,
    AboutUsPage,
    ExpiringPropertyPage,
    SetDefaultSearchPage,
    ChangePasswordPage,
    SetDefaultLanguagePage
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAMXqtYrfHbAE_7o_wEWN5Be7Mh7q-OxYY',
      libraries: ["places"]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    AddListingPage,
    SearchResultPage,
    LogoutPage,
    UserProfilePage,
    UpdateUser,
    Filter,
    PropertyDetailsPage,
    SettingsPage,
    SignupAuthenticationPage,
    UserPropertyPage,
    UploadPropertyImagePage,
    UpdatePropertyPage,
    AboutUsPage,
    ExpiringPropertyPage,
    SetDefaultSearchPage,
    ChangePasswordPage,
    SetDefaultLanguagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginProvider,
    UtilityProvider,
    UserProvider,
    PropertyProvider,
    LocalstorageProvider,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    FileChooser,
    Network
  ]
})
export class AppModule {}
