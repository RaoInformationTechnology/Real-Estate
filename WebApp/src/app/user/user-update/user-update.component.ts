import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
	selector: 'app-user-update',
	templateUrl: './user-update.component.html',
	styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
	@ViewChild('userUpdateForm') userUpdateForm : NgForm;
	private sub : any;
	userID :  number;
	userToUpdate;
	response;
	allCity;
	City=[];
	selectedCity;
	public loading = false;
	allCountries;
	Countries=[]
	selectedCountry={};
	constructor(private userSer: UserService,
		private sweetAlertSer: SweetalertService,
		private proprtySer: PropertyService,
		private route:ActivatedRoute,
		private router:Router) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.userID = params['id'];
		});
		this.getSingleUser(this.userID);
	}

	getSingleUser(userID){
		this.loading = true;
		this.userSer
		.getUser(userID)
		.subscribe(data =>{
			console.log(data);
			this.userToUpdate = data;
			this.loading = false;
			this.getAllCountriesOfWorld();
		},err =>{
			// console.log("Its an Error", err);
			this.loading = false;
		})
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
				this.userToUpdate.country = this.allCountries[i]._id;
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
			}
			this.loading = false;
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
				this.userToUpdate.city = this.allCity[i]._id;
				break;
			}
		}
	}

	update(userUpdateForm){

		// console.log(userUpdateForm);
		this.loading = true;
		this.userSer
		.updateUser(userUpdateForm)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert('User details Updated Successfully!');
			this.router.navigate(["userDetail",this.userToUpdate._id]);
			this.loading = false;
		},err=>{
			this.sweetAlertSer.sweetAlertError();
			this.loading = false;
		})
	}
}