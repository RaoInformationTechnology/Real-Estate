import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../service/property.service';
import { UtilityService } from '../../utility.service';
import { LocalStorageService } from '../../local-storage.service';
import { SweetalertService } from '../../service/sweetalert.service';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	buyProperties=[];
	rentProperties=[];
	Rent=[];
	Buy=[];
	image_url;
	userType;
	public loading = false;
	propertyType;
	city;
	country;
	searchQuery={buyRent:'',
	propertyType:'',
	country:'',
	city:''}
	selectedCountry={country:''};
	constructor(private propertySer: PropertyService, 
		private utilitySer: UtilityService, 
		private router: Router,
		private _localstorage: LocalStorageService,
		private _sweetAlert: SweetalertService) {
		this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {

		this.userType = this._localstorage.getUserType();
		// console.log("User Type",this.userType);
		this.getPropertiesBuy('Buy');
		this.getPropertiesRent('Rent');
		// var images = [];
		// images.push("assets/slider/1.jpg");
		// images.push("assets/slider/2.jpg");
		// images.push("assets/slider/3.jpg");
		// images.push("assets/slider/4.jpg");
		// images.push("assets/slider/5.jpg");
		// images.push("assets/slider/6.jpg");
		// images.push("assets/slider/7.jpg");
		// images.push("assets/slider/9.jpg");

		// $("#slider-div").css({
		// 	'background-image':'url("'+images[3]+'")'
		// });

		// var count = 4;
		// setInterval(function() { 
		// 	console.log("Slideshow Image : ",count);
		// 	$("#slider-div").css({
		// 		'transition': 'all 0.7s',
		// 		'background-image':'url("'+images[count]+'")'
		// 	});
		// 	count = (count == images.length - 1) ? 0 : count+1;

		// },5000);
		this.getPropertyType();
		this.getCountry();
		$('#myCarouselRent').carousel({
			pause: true,
			interval: false
		});

		$('#myCarouselBuy').carousel({
			pause: true,
			interval: false
		});

	}

	changeBuyRent(event){
		// console.log(event);
		this.searchQuery['buyRent'] = event.target.value;
		// console.log(this.searchQuery);
	}

	changePropertyType(event){
		// console.log(event);
		this.searchQuery['propertyType'] = event.target.value;
		// console.log(this.searchQuery);
	}

	changeCity(event){
		// console.log(event);
		this.searchQuery['city'] = event.target.value;
		// console.log(this.searchQuery);
	}

	buyOrRent(type){
		this.router.navigate(["property",type]);
	}

	viewDetails(id){
		this.router.navigate(['propertyDetails/',id]);
	}

	getPropertiesBuy(type){
		// this.loading = true;
		this.propertySer
		.getBuyOrRentProperty(type)
		.subscribe(data =>{
			this.loading = false;
			for(var i=0;i<3;i++){
				this.buyProperties.push(data[i])
				console.log("buy properties for customer",this.buyProperties);
			}
			this.Buy.push(this.buyProperties);
			this.buyProperties=[];
			for(var i=3;i<6;i++){
				this.buyProperties.push(data[i])
			}
			this.Buy.push(this.buyProperties);
			this.buyProperties=[];
			for(var i=6;i<9;i++){
				this.buyProperties.push(data[i])
			}
			this.Buy.push(this.buyProperties);
			// console.log(this.Buy);
		},err =>{
			console.log("Its an Error", err);
			this.loading = false;
		})

	}

	getPropertiesRent(type){
		// this.loading = true;
		this.propertySer
		.getBuyOrRentProperty(type)
		.subscribe(data =>{
			this.loading = false;
			for(var i=0;i<3;i++){
				this.rentProperties.push(data[i])
				console.log("get rent properties details================>>>>>>>>>>>",this.rentProperties);
			}
			this.Rent.push(this.rentProperties);
			this.rentProperties=[];
			for(var i=3;i<6;i++){
				this.rentProperties.push(data[i])
			}
			this.Rent.push(this.rentProperties);
			this.rentProperties=[];
			for(var i=6;i<9;i++){
				this.rentProperties.push(data[i])
			}
			this.Rent.push(this.rentProperties);
			console.log("rent properties details==================",this.Rent);
		},err =>{
			console.log("Its an Error", err);
			this.loading = false;
		})

	}

	getPropertyType(){
		this.propertySer
		.getPropertyType()
		.subscribe(data =>{
			// console.log(data);
			this.propertyType = data
		},err =>{
			console.error(err);
		})
	}

	getCountry(){
		this.propertySer
		.getCountry()
		.subscribe(data =>{
			// console.log(data);
			this.country = data;
		},err =>{
			console.error(err);
		})
	}

	valueChangeofCountry(event){
		this.searchQuery['country'] = event.target.value;
		// console.log(this.searchQuery.country);
		this.selectedCountry['country'] = event.target.value;
		this.getCountryWiceCity(this.selectedCountry);
	}

	getCountryWiceCity(id){
		this.loading = true;
		this.propertySer
		.getCityByCountry(id)
		.subscribe(data =>{
			// console.log(data);
			this.city = data;
			this.loading = false;
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	search(){
		// console.log(this.searchQuery);
		// this.router.navigate(['/search'], {queryParams: this.searchQuery})
		if(this.searchQuery.buyRent != "" && this.searchQuery.city != ""
			&& this.searchQuery.country != "" && this.searchQuery.propertyType != ""){
				this.router.navigate(['/search'], {queryParams: this.searchQuery})
			}else{
				this._sweetAlert.sweetAlertSelectAllField();
			}
	}

}
