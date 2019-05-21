import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../service/property.service';
import { UtilityService } from '../../utility.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { PagerService } from '../../pager.service';
import { LocalStorageService } from '../../local-storage.service';
import 'rxjs/add/operator/filter';
declare var $:any;

@Component({
	selector: 'app-user-home',
	templateUrl: './user-home.component.html',
	styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
	searchQuery={buyRent:'',
	propertyType:'',
	country:'',
	city:''}
	propertyType;
	city;
	country;
	selectedCountry={country:''};
	allProperty=[];
	userType;
	view='list';
	lat: number = 41.7545;
	lng: number = -88.2915;
	zoom: number = 7;
	location= [];
	image_url;
	properties;
	public loading = false;
	pager: any = {};
	pagedItems: any[];
	constructor(private propertySer: PropertyService, private localstorage: LocalStorageService,
		private utilitySer: UtilityService,private pagerService: PagerService, private router: Router,
		private _sweetAlert: SweetalertService, private route: ActivatedRoute){
		this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {
		this.closeToggle();
		this.userType = this.localstorage.getUserType();
		// console.log(this.userType);
		this.getPropertyType();
		this.getCountry();
		this.route.queryParams
		.subscribe(params => {
	        // console.log(params); // {order: "popular"}
	        let q = params;
	        if(JSON.stringify(q)!='{}'){
	 			this.searchQuery.buyRent = q.buyRent;
	 			this.searchQuery.propertyType = q.propertyType;
	 			this.searchQuery.country = q.country;
	 			this.selectedCountry.country = q.country;
	 			this.getCountryWiceCity(this.selectedCountry);
	 			this.searchQuery.city = q.city;
	        	this.search(q);
	        }
	    });
	}

	ConvertToNumber(value){
		return Number(value);
	}

	openToggle(){
		$("#mini-fab").css('display', 'block');
		$("#openFab").css('display', 'none');
		$("#closeFab").css('display', 'block');
	}

	closeToggle(){
		$("#mini-fab").css('display', 'none');
		$("#openFab").css('display', 'block');
		$("#closeFab").css('display', 'none');
	}
	sortByLowToHigh(){
		// console.log("----------Low TO High-----------");
		this.properties = this.localstorage.getAllProperties();

		this.properties.sort( function(property1, property2) {
			if ( property1.price < property2.price ){
				return -1;
			}else if( property1.price > property2.price ){
				return 1;
			}else{
				return 0;    
			}
		});
		this.setPage(1);
		// console.log("all Properties", this.allProperty);
		// console.log("properties", this.properties);
	}

	sortByHighToLow(){
		// console.log("-----------High To Low ----------------");
		this.properties = this.localstorage.getAllProperties();
		this.properties.sort( function(property1, property2) {
			if ( property1.price > property2.price ){
				return -1;
			}else if( property1.price < property2.price ){
				return 1;
			}else{
				return 0;    
			}
		});
		this.setPage(1);
	}

	newFirst(){
		// console.log("------------------Junagdh-----------------");
		this.properties = this.localstorage.getAllProperties();
		this.properties.reverse();
		this.setPage(1);
		// console.log("all Properties", this.allProperty);
		// console.log("properties", this.properties);
	}

	oldFirst(){
		// console.log("--------------Rajkot-----------------");
		this.properties = this.localstorage.getAllProperties();
		this.setPage(1);
		// console.log("all Properties", this.allProperty);
		// console.log("properties", this.properties);
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

	valueChangeofCountry(){
		// console.log(this.searchQuery.country);
		this.selectedCountry['country'] = this.searchQuery.country;
		this.getCountryWiceCity(this.selectedCountry);
	}

	getCountryWiceCity(id){
		this.propertySer
		.getCityByCountry(id)
		.subscribe(data =>{
			// console.log(data);
			this.city = data;
		},err =>{
			console.error(err);
		})
	}

	setOption(option){
		if(option == 'Buy'){
			$('button.buy').css({'background-color': '#0b7997',
				'color': 'white',
				'font-weight': '700'})
			$('button.rent').css({'background-color': '#e6e4e4',
				'color': 'black',
				'font-weight': '300'})
			this.searchQuery['buyRent']=option;
		}
		else if (option == 'Rent'){
			$('button.rent').css({'background-color': '#0b7997',
				'color': 'white',
				'font-weight': '700'})
			$('button.buy').css({'background-color': '#e6e4e4',
				'color': 'black',
				'font-weight': '300'})
			this.searchQuery['buyRent']=option;
		}
	}

	search(query?){
		// console.log(query);
		if(query==undefined){
			if(this.searchQuery.buyRent != "" && this.searchQuery.city != ""
			&& this.searchQuery.country != "" && this.searchQuery.propertyType != ""){
				this.searchProperty(this.searchQuery);
			}else{
				this._sweetAlert.sweetAlertSelectAllField();
			}
		}else {
			this.searchProperty(query);
		}
	}
	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}

        // get pager object from service
        this.pager = this.pagerService.getPager(this.allProperty.length, page);

        // get current page of items
        this.pagedItems = this.properties.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    searchProperty(query){
    	this.loading = true;
    	this.propertySer
    	.searchProperty(query)
    	.subscribe(data =>{
    		// console.log("search Result", data);
    		if(data.length>0){
	    		this.allProperty=data;
	    		localStorage.setItem('properties', JSON.stringify(data))
	    		for(var i=0;i<this.allProperty.length;i++){
		    		// this.location[i].lat=Number(this.allProperty[i].lat);
		    		// this.location[i].lng=Number(this.allProperty[i].lon)
		    		this.location.push({
		    			lat:Number(this.allProperty[i].lat),
		    			lng:Number(this.allProperty[i].lon),
		    			label: i.toString(),
		    		});
		    		this.oldFirst();
		    		this.loading = false;
	    		}
	    		// console.log(this.location);
    		}else{
    			this.allProperty = [];
    			localStorage.setItem('properties', JSON.stringify(data))
    			this.loading = false;
    		}
    },err =>{
    	console.error(err);
    	this.loading = false;
    })
    }

    viewDetails(id){
    	// console.log("property id",id);
    	this.router.navigate(['propertyDetails/',id]);
    }

    mapView(){
    	this.view='list';
    }

    listView(){
    	this.view='map';
    }

}
