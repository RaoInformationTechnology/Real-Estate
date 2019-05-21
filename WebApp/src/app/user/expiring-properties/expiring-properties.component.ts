import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { LocalStorageService } from '../../local-storage.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { PagerService } from '../../pager.service';

@Component({
	selector: 'app-expiring-properties',
	templateUrl: './expiring-properties.component.html',
	styleUrls: ['./expiring-properties.component.css']
})
export class ExpiringPropertiesComponent implements OnInit {
	public loading = false;
	expiringProperties=[];
	user;
	pager: any = {};
	pagedItems: any[];
	count:any;
	constructor(private _propertyService: PropertyService, private _localStorage: LocalStorageService,
		private pagerService: PagerService, private _sweetAlert: SweetalertService){
		// this.expiringProperties = JSON.parse(localStorage.getItem('properties'));
		this.user = this._localStorage.getUser();
	}

	ngOnInit() {
		this.getExpiringPropertyCount(this.user._id);
		// this.getExpiringProperty(this.user._id);
	}

	getExpiringProperty(id,page){
		this.loading = true;
		this.expiringProperties = [];
		this._propertyService
		.getExpiringProperties(id,page)
		.subscribe(data =>{
			this.loading = false;
			// console.log("expiringProperties", data);
			this.expiringProperties = data;
			// this.loading = false;
		},err =>{
			this._sweetAlert.sweetAlertError();
			// this.loading = false;
		})
	}

	getExpiringPropertyCount(id){
		this.loading = true;
		this._propertyService
		.getExpiringPropertiesCount(id)
		.subscribe(data =>{
			this.count = data;
			this.setPage(1);
		},err =>{
			this._sweetAlert.sweetAlertError();
			this.loading = false;
		})
	}

	sendRequest(id){
		let credentials={'agent_id':this.user._id, 'property_id':id};
		this.loading=true;
		this._propertyService
		.renewProperty(credentials)
		.subscribe(data =>{
			// console.log("Responce of request", data);
			this._sweetAlert.sweetAlert("Property renewal request sent successfully");
			this.loading=false;
		},err =>{
			this._sweetAlert.sweetAlertError();
			this.loading=false;
		})
	}

	deleteProperty(id){
		this.loading=true;
		this._propertyService
		.deleteProperty(id)
		.subscribe(data =>{
			this._sweetAlert.sweetAlert("Your property is deleted successfully.");
			this.loading=false;
			// this.getExpiringProperty(this.user._id,page);
		},err =>{
			this._sweetAlert.sweetAlertError();
			this.loading=false;
		})
	}

	setPage(page: number) {
        // get pager object from service
        // alert("page", page);
        console.log(page, this.pager.totalPages);

        if (page < 1 || page > this.pager.totalPages) {
        	return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.count, page);
        console.log("Pager", this.pager);
        // get current page of items
        page = page;
        console.log("Page", page);
        this.getExpiringProperty(this.user._id,page);
        // this.pagedItems = this.getExpiringProperty.slice(this.pager.startIndex, this.pager.endIndex + 1);



    }

}
