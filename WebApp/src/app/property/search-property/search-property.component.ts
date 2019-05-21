import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { Router } from '@angular/router';
import { SweetalertService } from '../../service/sweetalert.service';
import { LocalStorageService } from '../../local-storage.service';
import { UtilityService } from '../../utility.service';

declare var $: any;

@Component({
	selector: 'app-search-property',
	templateUrl: './search-property.component.html',
	styleUrls: ['./search-property.component.css']
})
export class SearchPropertyComponent implements OnInit {
	allProperty = [];
	property;
	properties;
	id:string;
	userType;
	image_url;
	public loading = false;
	constructor(private proprtySer: PropertyService,
		private sweetAlertSer: SweetalertService,
		private router: Router,
		private utilitySer: UtilityService,
		private localstorage: LocalStorageService){
		this.properties = this.localstorage.getAllProperties();
		this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {
		$('#nopropertyfound').css('display','none');
		this.userType = this.localstorage.getUserType();
		// console.log(this.userType);
		// this.getAllProperty();

	}
	
	// getAllProperty(){

	// 	this.proprtySer
	// 	.getProperties()
	// 	.subscribe(data =>{
	// 		this.allProperty = data;
	// 		console.log("All Property", this.allProperty);
	// 	},err =>{
	// 		console.log("Its an Error", err);
	// 	})
	// }


	search(){
		if(this.id != undefined){
			// console.log("Text value", this.id);
			let uniqueID = this.id.toUpperCase();
			// console.log("Uppercase Id", uniqueID);
			this.loading = true;
			this.proprtySer
			.getSearchByUniqueId(uniqueID)
			.subscribe(data =>{
				this.allProperty = data;
				$('#nopropertyfound').css('display','block');
				$('#nopropertySearch').css('display','none');
				// console.log("All Property", this.allProperty);
				this.loading = false;
			},err =>{
				console.log("Its an Error", err);
				this.loading = false;
			})	
		}else{
			this.sweetAlertSer.sweetAlertError();
	}

		
	}

	viewDetails(id){
		// console.log("property id",id);
		this.router.navigate(['propertyDetails/',id]);
	}

}
