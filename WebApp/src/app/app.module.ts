import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpModule } from '@angular/http';
import { FacebookModule } from 'ngx-facebook';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angular5-social-login";
import { AgmCoreModule } from '@agm/core';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { UserSignUpComponent } from './user/user-sign-up/user-sign-up.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { CreatePropertyComponent } from './property/create-property/create-property.component';
import { PropertyDetailsComponent } from './property/property-details/property-details.component';
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { UpdatePropertyComponent } from './property/update-property/update-property.component';
import { PropertyTypeComponent } from './property/property-type/property-type.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { PropertyListingConformationComponent } from './property/property-listing-conformation/property-listing-conformation.component';
import { SearchPropertyComponent } from './property/search-property/search-property.component';
import { UserWisePropertyComponent } from './user/user-wise-property/user-wise-property.component';
import { MassUploadComponent } from './property/mass-upload/mass-upload.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { HomeComponent } from './guest/home/home.component';
import { BuyOrRentComponent } from './guest/buy-or-rent/buy-or-rent.component';
import { AboutUsComponent } from './guest/about-us/about-us.component';
import { ContactUsComponent } from './guest/contact-us/contact-us.component';
import { SignupAuthenticationComponent } from './user/signup-authentication/signup-authentication.component';
import { ExpiringPropertiesComponent } from './user/expiring-properties/expiring-properties.component';
import { ExtendPendingRequestComponent } from './property/extend-pending-request/extend-pending-request.component';

import { Routing } from './app.routing';
import { HttpService } from './http.service';
import { UtilityService } from './utility.service';
import { AuthServices } from './auth.service';
import { LoginGuard, AdminGuard, AgentGuard, SignupGuard, PropertyTypeGuard } from './auth.guard';
import { UserService } from './service/user.service';
import { PropertyService } from './service/property.service';
import { PropertyTypeService } from './service/property-type.service';
import { SweetalertService } from './service/sweetalert.service';
import { LocalStorageService } from './local-storage.service';
import { PagerService } from './pager.service';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("1977606375586139")  
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("303168554872-au7225f7e2loq2pnj73fkcqvakn0rdc7.apps.googleusercontent.com")
    }
    ]
    );
  return config;
}

@NgModule({
  declarations: [
  AppComponent,
  MenuComponent,
  LoginComponent,
  UserSignUpComponent,
  UserDetailsComponent,
  CreatePropertyComponent,
  PropertyDetailsComponent,
  UserUpdateComponent,
  UpdatePropertyComponent,
  PropertyTypeComponent,
  PropertyListComponent,
  UserListComponent,
  PropertyListingConformationComponent,
  SearchPropertyComponent,
  UserWisePropertyComponent,
  MassUploadComponent,
  UploadImagesComponent,
  HomeComponent,
  BuyOrRentComponent,
  AboutUsComponent,
  UserHomeComponent,
  ContactUsComponent,
  SignupAuthenticationComponent,
  ExpiringPropertiesComponent,
  ExtendPendingRequestComponent,
  ],
  imports: [
  BrowserModule,
  ReactiveFormsModule,
  FormsModule,
  HttpModule,
  Routing,
  SocialLoginModule,
  FacebookModule.forRoot(),
  Ng2AutoCompleteModule,
  AgmCoreModule.forRoot({
      apiKey: "AIzaSyAMXqtYrfHbAE_7o_wEWN5Be7Mh7q-OxYY",
      libraries: ["places"]
    }),
  ReCaptchaModule,
  LoadingModule
  ],
  providers: [
  UtilityService,
  AuthServices,
  LoginGuard,
  AdminGuard,
  AgentGuard,
  SignupGuard,
  PropertyTypeGuard,
  UserService,
  HttpService,
  PropertyService,
  CookieService,
  PropertyTypeService,
  { provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs },
    SweetalertService,
    CreatePropertyComponent,
    LocalStorageService,
    PagerService
    ],
    bootstrap: [AppComponent]
  })
export class AppModule { }
