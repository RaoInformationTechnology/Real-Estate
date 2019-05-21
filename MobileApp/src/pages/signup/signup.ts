import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { UserProvider } from '../../providers/user/user';
import { SignupAuthenticationPage } from '../signup-authentication/signup-authentication';

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {
	signupForm: FormGroup;
	countries;
	selectedCountry={country:''};
	cities;
	countryId;
	cityId;
	state;
	flag:boolean=false;
	newCity:string;
	newState:string;
	city;
	loader;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		private alertCtrl: AlertController, private loginSer: LoginProvider,
		private userSer: UserProvider,private loadingCtrl: LoadingController) {
		this.createSignUpForm();
	}

	ionViewDidLoad() {
		this.getCountry();
	}
	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Loading, Please wait",
			// duration: 2000
		});
	}

	createSignUpForm(){
		this.signupForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName : new FormControl("", Validators.required),
			address : new FormControl("", Validators.required),
			postalCode : new FormControl("", Validators.required),
			city : new FormControl(""),
			state : new FormControl(""),
			country : new FormControl(""),
			email : new FormControl("", Validators.email),
			phone : new FormControl("", Validators.required),
			mobile : new FormControl("", Validators.required),
			company : new FormControl("", Validators.required),
			password : new FormControl("", Validators.required),
			cpassword : new FormControl("", Validators.required),
			admin : new FormControl("", Validators.required),
			userStatus: new FormControl()
		});
	}

	loginPage(){
		this.navCtrl.pop();
	}

	checkConfirmPassword(){
		if((document.getElementById('password') as HTMLInputElement).value === (document.getElementById('cpassword') as HTMLInputElement).value){
		} else {
			(document.getElementById('cpassword') as HTMLInputElement).value = "";
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Entered Password & Confirm Password does not match!',
				buttons: ['OK']
			});
			alert.present();
		}
	}

	getCountry(){
		this.userSer
		.getWorldCountries()
		.subscribe(data =>{
			this.countries = data;
			console.log("Country", this.countries);
		},err =>{
			console.error(err);
		})
	}
	changeCountry(id){
		this.presentLoading();
		console.log(id);
		this.countryId = id;
		this.loader.present();
		this.selectedCountry['country'] = id;
		this.getCountryWiseCity(this.selectedCountry);
		console.log("mdi jaje kaik================",this.selectedCountry);
	}

	getCountryWiseCity(id){
		console.log("City Id", id);
		this.userSer
		.getCountryWiseWorldCities(id)
		.subscribe(data =>{
			console.log("Country Wise City",data);
			this.cities = data;
			this.loader.dismiss();
		},err =>{
			console.error(err);
			this.loader.dismiss();
		})
	}

	changeCity(city){
		console.log(city);
		this.cityId = city;
		// for(var i=0;i<this.cities.length;i++){
		// 	if(city === this.cities[i]._id){
		// 		this.state = this.cities[i].region;
		// 	}
		// }
	}

	userSingUp(signupForm){
		if(signupForm.password === signupForm.cpassword){
			delete signupForm.cpassword;
			signupForm['userStatus']='false';
			signupForm['country'] = this.countryId;
			signupForm['city'] = this.cityId;
			console.log(signupForm);
			this.loginSer
			.signUp(signupForm)
			.subscribe(data =>{
				let alert = this.alertCtrl.create({
					title: 'Success!',
					subTitle: 'User Signed up successfully!',
					buttons: ['OK']
				});
				alert.present();
				this.navCtrl.push(SignupAuthenticationPage, {user:data});
			},err=>{
				let alert = this.alertCtrl.create({
					title: 'Error!',
					subTitle: 'Something went wrong. Please try again later',
					buttons: ['OK']
				});
				alert.present();
			})
		}else{
			let alert = this.alertCtrl.create({
				title: 'Error!',
				subTitle: 'Entered Password & Confirm Password does not match!',
				buttons: ['OK']
			});
			alert.present();
		}
	}

	addCity(){
		this.flag = true;
	}

	cancle(){
		this.flag = false;
		this.newCity = "";
		this.newState = "";
	}

	saveTheCity(){
		this.userSer.getEnteredCity(this.newCity)
		.subscribe(data =>{
			if(data.status == 202){
				let res = data.json();
				console.log(res.country);
				if(res.country == undefined){
					let newcity = res[0];
					newcity['country'] = this.selectedCountry.country;
					this.updateCity(newcity);
				}
			}else if(data.status == 201){
					let newcity = {name:this.newCity,
									country: this.selectedCountry.country,
									region: this.newState};
					console.log(newcity);
					this.addNewCity(newcity);
			}
		},err =>{
			console.error(err);
		})
	}

	updateCity(city){
		this.userSer.updateCity(city)
		.subscribe(data =>{
			if(data){
				console.log("update city", data);
				this.selectedCountry.country = data.country;
				this.getCountryWiseCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data._id;
				this.flag = false;
			}
		},err =>{
			console.error(err);
		});
	}

	addNewCity(city){
		this.userSer.addNewCity(city)
		.subscribe(data =>{
			if(data){
				console.log("update city", data);
				this.selectedCountry.country = data.country;
				this.getCountryWiseCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data._id;
				this.flag = false;
			}
		},err =>{
			console.error(err);
		});
	}


}
