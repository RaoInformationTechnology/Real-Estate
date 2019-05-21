import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { LocalStorageService } from '../../local-storage.service';
import { PagerService } from '../../pager.service';
import { AuthServices } from '../../auth.service';
import { UtilityService } from '../../utility.service';

import * as _ from 'underscore';
declare var $: any;
@Component({
	selector: 'app-buy-or-rent',
	templateUrl: './buy-or-rent.component.html',
	styleUrls: ['./buy-or-rent.component.css']
})
export class BuyOrRentComponent implements OnInit {
	public loading = false;
	sub:any;
	type;
	allProperty=[];
	properties=[];
	cities=[];
	propertyType=[];
	cityname;
	j=0;
	userType;
	buttonOfSort= false;
	pager: any = {};
	pagedItems: any[];
	loggedin;
	image_url;
	constructor(private propertySer: PropertyService,
		private sweetAlertSer: SweetalertService,
		private route: ActivatedRoute,
		private router: Router,
		private auth: AuthServices,
		private utilitySer: UtilityService,
		private pagerService: PagerService, 
		private localstorage: LocalStorageService) {
		this.loggedin = this.auth.check();
		// console.log(this.loggedin.value);
		this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.type = params['type'];
			this.getPropertiesByType(this.type);
		});
			this.closeToggle();
	}


	getPropertiesByType(type){
		this.loading = true;
		this.allProperty = [];
		this.propertySer
		.getBuyOrRentProperty(type)
		.subscribe(data =>{
			// console.log("all Properties:", data);
			this.allProperty = data;
			localStorage.setItem('properties', JSON.stringify(data));
			this.newFirst();
            // this.setPage(1);
            this.loading = false;
        },err =>{
        	console.log("Its an Error", err);
        	this.loading = false;
        })

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
		// console.log("all Properties", this.allProperty);
		// console.log("properties", this.properties);
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

	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}

        // get pager object from service
        this.pager = this.pagerService.getPager(this.allProperty.length, page);

        // get current page of items
        this.pagedItems = this.properties.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    viewDetails(id){
    	// console.log("property id",id);
    	this.router.navigate(['propertyDetails/',id]);
    }
}
