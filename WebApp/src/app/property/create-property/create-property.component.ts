import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PropertyService } from '../../service/property.service';
import { UserService } from '../../service/user.service';
import { LocalStorageService } from '../../local-storage.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-create-property',
	templateUrl: './create-property.component.html',
	styleUrls: ['./create-property.component.css']
})
export class CreatePropertyComponent implements OnInit {
	createProperty: FormGroup;
	allUser;
	users=[];
	Type=[];
	City=[];
	allCity;
	state="";
	country=[];
	selectedCity;
	propertyType;
	propertyTypeId;
	agentID;
	userType;
	rooms:number = null;
	public loading = false;
	allCountry;
	selectedCountry={country:''};
	cityId;
	flag:boolean=false;
	newCity:string;
	newState:string;
	city;
	currency = 'euro';
	constructor(private fb: FormBuilder,
		private propertySer: PropertyService,
		private sweetAlertSer: SweetalertService,
		private router: Router,
		private userSer: UserService,private localstorage: LocalStorageService) {
		this.createForm();
	}

	createForm(){
		this.createProperty = new FormGroup({
			propertyType: new FormControl("",),
			propertyAddress: new FormControl("", Validators.required),
			agent: new FormControl(""),
			postalCode: new FormControl("", Validators.required),
			country: new FormControl("",),
			city: new FormControl("",),
			state: new FormControl(""),
			// status: new FormControl("", Validators.required),
			price: new FormControl("", Validators.required),
			currency: new FormControl("euro"),
			rooms: new FormControl("",),
			// imagesUrl: new FormControl(""),
			area: new FormControl(""),
			buyRent: new FormControl("", Validators.required),
			garage: new FormControl(false, Validators.required),
			garden: new FormControl(false, Validators.required),
			swimmingPool: new FormControl(false, Validators.required),
			// lon:new FormControl("", Validators.required),
			// lat:new FormControl("", Validators.required),
			additionalInfo:new FormControl("")
		})
	}

	ngOnInit() {
		this.userType = this.localstorage.getUserType();
		// console.log("user Type", this.userType);
		if (this.userType == 1) {
			this.agentID = this.localstorage.getUserId();
			this.createProperty['agent'] = this.agentID;
		}
		else{
			this.getUser();
		}
		this.getPropertyType();
		this.getCountry();
		// console.log("Create Property",this.createProperty);
	}

	getCity(){
		this.propertySer
		.getCities()
		.subscribe(data =>{
			// console.log("city", data);
			this.allCity = data;
			for(var i=1; i < data.length; i++){
				this.City[i] = data[i].name;
			}
		},err =>{
			console.error(err);
		})
	}

	changeRoom(event){
		this.rooms = event.target.value;
		this.createProperty['rooms']=event.target.value;
	}

	changeCurrency(event){
		console.log(event);
		this.currency = event;
		this.createProperty['currency']=event;
	}

	getCountryWiceCity(id){
		this.propertySer
		.getCityByCountry(id)
		.subscribe(data =>{
			// console.log(data);
			this.allCity = data;
			for(var i=0; i < data.length; i++){
				this.City[i] = data[i].name;
			}
			this.loading = false;
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	getCountry(){
		this.propertySer
		.getCountry()
		.subscribe(data =>{
			// console.log(data);
			this.allCountry=data;
			for(var i=0; i < data.length; i++){
				this.country[i] = data[i].name;
			}
		},err =>{
			console.error(err);
		})
	}

	getPropertyType(){
		this.propertySer
		.getPropertyType()
		.subscribe(data =>{
			this.propertyType = data;
			// console.log("Property Type", this.propertyType);
			for(var i=0; i < data.length; i++){
				this.Type[i] = data[i].name;
			}
		},err =>{
			console.error(err);
		})
	}

	getUser(){
		this.userSer
		.getUsers()
		.subscribe(data => {
			this.allUser = data;
			for(var i=0; i < data.length; i++){
				this.users[i] = data[i].firstName+" "+data[i].lastName;
			}
			// console.log("Agents", this.users);
		},err => {
			console.log("Its an Error", err);
		})
	}

	valueChangedOfagent(agentName){
		for (var i = 0; i < this.allUser.length; i++)
		{
			if (agentName == this.allUser[i].firstName+" "+this.allUser[i].lastName)
			{
				this.agentID = this.allUser[i]._id;
				// console.log(this.agentID);
				break;
			}
		}
	}

	valueChangedOfType(propertyType){
		for (var i = 0; i < this.propertyType.length; i++)
		{
			if (propertyType == this.propertyType[i].name)
			{
				this.propertyTypeId = this.propertyType[i]._id;
				// console.log(this.propertyTypeId);
				this.createProperty['propertyType']=this.propertyTypeId;
				break;
			}
		}
	}

	valueChangedOfCountry(countryName){
		console.log(countryName);
		for (var i = 0; i < this.allCountry.length; i++)
		{
			if (countryName == this.allCountry[i].name)
			{
				this.createProperty['country'] = this.allCountry[i]._id;
				this.selectedCountry['country'] = this.allCountry[i]._id;
				this.loading = true;
				this.getCountryWiceCity(this.selectedCountry);
				break;
			}
		}
	}

	valueChangedOfCity(cityName){
		for (var i = 0; i < this.allCity.length; i++)
		{
			if (cityName == this.allCity[i].name)
			{
				// console.log(this.allCity[i]);
				this.cityId = this.allCity[i]._id;
				this.createProperty['city'] = this.cityId;
				this.state = this.allCity[i].region;
				break;
			}
		}
	}

	checkCity(event){
		if(event == undefined){
			this.state = "";
			// this.country = "";
		}
	}

	create(createProperty){
		createProperty['agent'] = this.agentID;
		createProperty['status'] = 'Unavailable';
		createProperty['propertyType'] = this.propertyTypeId;
		createProperty['city'] = this.cityId;
		createProperty['state'] = this.state;
		createProperty['country'] = this.selectedCountry.country;
		createProperty['rooms'] = this.rooms;
		createProperty['currency'] = this.currency;
		if(this.userType == 0){
			createProperty['verify'] = true;
		}
		console.log("Create Property",createProperty);
		this.loading = true;
		this.propertySer
		.addProperty(createProperty	)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlertPropertyUploaded();
			this.router.navigate(['uploadImages', data._id]);
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
		this.propertySer.getEnteredCity(this.newCity)
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
		this.propertySer.updateCity(city)
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
		this.propertySer.addNewCity(city)
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
