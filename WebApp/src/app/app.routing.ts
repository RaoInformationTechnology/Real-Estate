import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginGuard, AdminGuard, AgentGuard, SignupGuard, PropertyTypeGuard } from './auth.guard';

import { LoginComponent } from "./login/login.component";
import { UserSignUpComponent } from "./user/user-sign-up/user-sign-up.component";
import { UserDetailsComponent } from "./user/user-details/user-details.component";
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { CreatePropertyComponent } from './property/create-property/create-property.component';
import { UpdatePropertyComponent } from './property/update-property/update-property.component';
import { PropertyDetailsComponent } from './property/property-details/property-details.component';
import { PropertyTypeComponent } from './property/property-type/property-type.component';
import { PropertyListComponent} from './property/property-list/property-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { PropertyListingConformationComponent } from './property/property-listing-conformation/property-listing-conformation.component';
import { SearchPropertyComponent } from './property/search-property/search-property.component';
import { UserWisePropertyComponent } from './user/user-wise-property/user-wise-property.component';
import { BuyOrRentComponent } from './guest/buy-or-rent/buy-or-rent.component';
import { MassUploadComponent } from './property/mass-upload/mass-upload.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { HomeComponent } from './guest/home/home.component';
import { AboutUsComponent } from './guest/about-us/about-us.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { ContactUsComponent } from './guest/contact-us/contact-us.component';
import { SignupAuthenticationComponent } from './user/signup-authentication/signup-authentication.component';
import { ExpiringPropertiesComponent } from './user/expiring-properties/expiring-properties.component';
import { ExtendPendingRequestComponent } from './property/extend-pending-request/extend-pending-request.component';

const APP_ROUTES: Routes = [
{ path: '', component: HomeComponent },
{ path: 'property/:type', component: BuyOrRentComponent },
{ path: 'aboutUs', component: AboutUsComponent },
{ path: 'contactUs', component: ContactUsComponent },
{ path: 'login', component: LoginComponent },
{ path: 'signup', component: UserSignUpComponent },
{ path: 'userDetail/:id', canActivate:[LoginGuard], component: UserDetailsComponent},
{ path: 'userUpdate/:id', canActivate:[LoginGuard], component: UserUpdateComponent},
{ path: 'createProperty',canActivate: [AgentGuard], component: CreatePropertyComponent },
{ path: 'updateProperty/:id',canActivate: [AgentGuard], component: UpdatePropertyComponent },
{ path: 'propertyDetails/:id', component: PropertyDetailsComponent },
{ path: 'propertyType',canActivate: [AdminGuard], component: PropertyTypeComponent },
{ path: 'propertyList/:option', component: PropertyListComponent },
{ path: 'userList', canActivate: [AdminGuard], component: UserListComponent },
{ path: 'listingConformation',canActivate: [AdminGuard], component: PropertyListingConformationComponent },
{ path: 'searchProperty',canActivate: [AdminGuard], component: SearchPropertyComponent },
{ path: 'searchAgentWiseProperty/:id',canActivate: [AgentGuard], component: UserWisePropertyComponent },
{ path: 'massUpload',canActivate: [AdminGuard], component: MassUploadComponent },
{ path: 'uploadImages/:id',canActivate: [AgentGuard], component: UploadImagesComponent },
{ path: 'search', component: UserHomeComponent },
{ path: 'signup/authentication/:id', canActivate: [SignupGuard], component: SignupAuthenticationComponent },
{ path: 'properties-about-to-expire',canActivate: [AgentGuard], component: ExpiringPropertiesComponent },
{ path: 'pending-request-for-validity',canActivate: [AdminGuard], component: ExtendPendingRequestComponent }


// { canActivate: [AuthGuard], path: 'survey-question/:id', component: UpdateUserSurveyComponent }
    
];


export const Routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES, {useHash: true});
