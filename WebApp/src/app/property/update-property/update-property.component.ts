import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { PropertyTypeService } from '../../service/property-type.service';
import { UserService } from '../../service/user.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-update-property',
	templateUrl: './update-property.component.html',
	styleUrls: ['./update-property.component.css']
})
export class UpdatePropertyComponent implements OnInit {
	private sub : any;
	propretyID :  number;
	propertyToUpdate;
	allCity;
	City=[];
	selectedCity;
	allUser;
	users=[];
	agentID;
	agent;
	allTypes;
	Type=[];
	typeId;
	allCountry;
	country=[];
	selectedCountry={country:''};
	public loading = false;
	constructor(private proprtySer: PropertyService,
		private sweetAlertSer: SweetalertService,
		private route:ActivatedRoute, private _propertyType: PropertyTypeService,
		private userSer: UserService,private router:Router) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.propretyID = params['id'];
			// console.log("Property Id:", this.propretyID);
		});
		this.getSingleProperty(this.propretyID);
		this.getUser();
		this.getCountry();
		this.getPropertyType();
	}

	getSingleProperty(propertyID){
		this.loading = true;
		this.proprtySer
		.getProperty(propertyID)
		.subscribe(data =>{
			this.propertyToUpdate = data[0];
			// console.log(this.propertyToUpdate);
			this.typeId = this.propertyToUpdate.propertyType._id;
			// console.log(this.typeId);
			// this.getAgent(this.propertyToUpdate.agent);
			this.loading = false;
		},err =>{
			// this.sweetAlertSer.sweetAlertError();
			console.log("Its an Error", err);
			this.loading = false;
		})
	}

	getPropertyType(){
		this._propertyType
		.getPropertyTypes()
		.subscribe(data =>{
			this.allTypes = data;
			for(var i=0; i< data.length; i++){
				this.Type[i] = data[i].name;
			}
		})
	}

	getCity(){
		this.proprtySer
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

	getCountry(){
		this.proprtySer
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

	getAgent(id){
		this.userSer
    	.getUser(id)
    	.subscribe(data =>{
    		// console.log("Agent is",data);
    		this.agent = data;
    		this.propertyToUpdate.agent = this.agent.firstName+" "+this.agent.lastName;
    	},err =>{
    		// this.sweetAlertSer.sweetAlertError();
    		console.log("Its an Error", err);
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
				this.agentID = this.allUser[i];
				// console.log(this.agentID);
				break;
			}
		}
	}

	valueChangedOfCity(cityName){
		for (var i = 0; i < this.allCity.length; i++)
		{
			if (cityName == this.allCity[i].name)
			{
				this.selectedCity = this.allCity[i];
				// console.log("Selected City",this.selectedCity);
				this.propertyToUpdate.city.name = this.selectedCity.name;
				this.propertyToUpdate.state = this.selectedCity.region;
				this.propertyToUpdate.country.name = this.selectedCity.country.name;
				break;
			}
		}
	}

	valueChangedOfCountry(countryName){
		for (var i = 0; i < this.allCountry.length; i++)
		{
			if (countryName == this.allCountry[i].name)
			{
				this.selectedCountry['country'] = this.allCountry[i]._id;
				this.getCountryWiceCity(this.selectedCountry);
				break;
			}
		}
	}

	getCountryWiceCity(id){
		this.proprtySer
		.getCityByCountry(id)
		.subscribe(data =>{
			// console.log(data);
			this.allCity = data;
			for(var i=0; i < data.length; i++){
				this.City[i] = data[i].name;
			}
		},err =>{
			console.error(err);
		})
	}

	valueChangedOfType(typeName){
		// console.log("Selected Type:", typeName);
		for (var i = 0; i < this.allTypes.length; i++)
		{
			if (typeName == this.allTypes[i].name)
			{
				this.typeId = this.allTypes[i]._id;
				// console.log(this.typeId);
				break;
			}
		}
	}

	update(updateProperty){
		if(this.agentID){
			updateProperty['agent'] = this.agentID;
		}
		if(this.selectedCity){
			updateProperty['city'] = this.selectedCity;
			updateProperty['state'] = this.selectedCity.region;
			updateProperty['country'] = this.selectedCity.country;
		}
		updateProperty['propertyType'] = this.typeId;
		// console.log("update data",updateProperty);
		this.loading = true;
		this.proprtySer
		.updateProperty(updateProperty)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert('Property details updated successfully');
			this.router.navigate(['propertyDetails',this.propertyToUpdate._id]);
			this.loading = false;
		},err=>{
			this.sweetAlertSer.sweetAlertError();
			this.loading = false;
		})
	}
	
	updatePropertyImage(property){
		this.router.navigate(['uploadImages/', property]);
	}
}
