import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { Router } from '@angular/router';
import { ReCaptchaComponent } from 'angular2-recaptcha';
declare var $: any;

@Component({
	selector: 'app-user-sign-up',
	templateUrl: './user-sign-up.component.html',
	styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent implements OnInit {
	signupForm: FormGroup;
	City=[];
	allCity;
	state:string;
	country:string;
	selectedCity;
	allCountries;
	Countries=[];
	cityId;
	@ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
	public loading = false;
	selectedCountry={country:''};
	flag:boolean=false;
	newCity:string;
	newState:string;
	city;
	constructor(private userSer: UserService, private sweetAlertSer: SweetalertService,
		private propertySer: PropertyService, private router: Router) {
		this.createSignUpForm();
	}

	ngOnInit() {
		this.getAllCountriesOfWorld();
	}

	handleCorrectCaptcha(event){
		// console.log("Captcha response",event);
		this.signupForm['captchacode']=event;
	}

	createSignUpForm(){
		this.signupForm = new FormGroup({
			firstName: new FormControl("", Validators.required),
			lastName : new FormControl("", Validators.required),
			address : new FormControl("", Validators.required),
			postalCode : new FormControl("", Validators.required),
			city : new FormControl("", Validators.required),
			state : new FormControl("", Validators.required),
			country : new FormControl("", Validators.required),
			email : new FormControl("", Validators.email),
			phone : new FormControl("", Validators.required),
			mobile : new FormControl("", Validators.required),
			company : new FormControl("", Validators.required),
			password : new FormControl("", Validators.required),
			cpassword : new FormControl("", Validators.required),
			admin : new FormControl("", Validators.required),
			captchacode : new FormControl("",Validators.required)
		});
	}

	checkConfirmPassword(){
		if((document.getElementById('password') as HTMLInputElement).value !== (document.getElementById('cpassword') as HTMLInputElement).value){
			(document.getElementById('cpassword') as HTMLInputElement).value = "";
			this.sweetAlertSer.sweetAlertWrongPassword();
		}
	}

	getAllCountriesOfWorld(){
		this.userSer.getWorldCountries()
		.subscribe(data =>{
			this.allCountries=data;
			for(var i=0;i<data.length;i++){
				this.Countries[i] = data[i].name;
			}
		})
	}

	valueChangedOfCountry(event){
		console.log(event);
		for (var i = 0; i < this.allCountries.length; i++)
		{
			if (event == this.allCountries[i].name)
			{
				this.signupForm['country'] = this.allCountries[i]._id;
				this.selectedCountry['country'] = this.allCountries[i]._id;
				this.loading = true;
				this.getCountryWiceCity(this.selectedCountry);
				break;
			}
		}
	}

	getCountryWiceCity(id){
		this.userSer
		.getCountryWiseWorldCities(id)
		.subscribe(data =>{
			// console.log(data);
			this.allCity = data;
			for(var i=0; i < data.length; i++){
				this.City[i] = data[i].name;
				if(i == data.length-1){
					this.loading = false;
				}
			}
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	valueChangedOfCity(event){
		console.log(event);
		for (var i = 0; i < this.allCity.length; i++)
		{
			if (event == this.allCity[i].name)
			{
				this.signupForm['city'] = this.allCity[i]._id;
				this.cityId = this.allCity[i]._id;
				break;
			}
		}
	}


	userSingUp(signupForm){
		delete signupForm.cpassword;
		signupForm['userStatus'] = 'false';
		let token = this.captcha.getResponse();
		signupForm['captchacode']=token;
		signupForm['country'] = this.selectedCountry['country'];
		signupForm['city'] = this.cityId;
		console.log("User Data", signupForm);
		this.loading = true;
		this.userSer
		.signUp(signupForm)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert('User Signed up successfully!');
			localStorage.setItem("signedupUser", JSON.stringify(data));
			this.router.navigate(['/signup/authentication/', data._id]);
			this.loading = false;
		},err=>{
			this.sweetAlertSer.sweetAlertError();
			this.loading = false;
		})
	}

	addCity(){
		this.flag = true;
	}

	cancle(){
		this.flag = false;
		this.newCity="";
		this.newState="";
	}

	saveTheCity(){
		this.userSer.getEnteredCity(this.newCity)
		.subscribe(data =>{
			console.log("Res",data);
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
					this.addNewCity(newcity);
			}
		},err =>{
			console.error(err);
		})
	}

	updateCity(city){
		console.log("update",city);
		this.userSer.updateCity(city)
		.subscribe(data =>{
			if(data){
				console.log("update city", data);
				this.selectedCountry.country = data.country;
				this.getCountryWiceCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data.name;
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
				this.getCountryWiceCity(this.selectedCountry);
				this.state = data.region;
				this.cityId = data._id;
				this.city = data.name;
				this.flag = false;
			}
		},err =>{
			console.error(err);
		});
	}
}
