import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { PagerService } from '../../pager.service';

@Component({
	selector: 'app-property-listing-conformation',
	templateUrl: './property-listing-conformation.component.html',
	styleUrls: ['./property-listing-conformation.component.css']
})
export class PropertyListingConformationComponent implements OnInit {
	unavailableProperty=[];
	public loading = false;
	count: number;
	pager: any = {};
    pagedItems: any[];
    propertyCount;
	constructor(private propertySer: PropertyService, 
		private pagerService: PagerService, private sweetAlertSer: SweetalertService) { }

	ngOnInit() {
		this.getUnavailablePropertCount();
	}

	getUnavailablePropertCount(){
		this.propertySer
		.getUnverifiedPropertyCount()
		.subscribe(data =>{
			this.propertyCount = data;
			console.log("count", this.propertyCount);
			this.setPage(1);
		},err =>{
			this.sweetAlertSer.sweetAlertError();
		})
	}

	getUnavailableProperties(pageNum){
		this.loading = true;
		this.unavailableProperty=[];
		this.propertySer
		.getUnverifiedProperty(pageNum)
		.subscribe(data =>{
			this.count = data.length;
			this.unavailableProperty = data;
			this.loading = false;
			console.log("unavailableProperty = ", this.unavailableProperty);
			// this.setPage(1);
		},err =>{
			this.sweetAlertSer.sweetAlertError();
			console.error(err);
			this.loading = false;
		})
	}

	approveProperty(property){
		this.loading = true;
		this.propertySer
		.verifyProperty(property._id,"true")
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert("Property Approved Successfully");
			this.ngOnInit();
			this.loading = false;
		},err =>{
			this.sweetAlertSer.sweetAlertError();
			console.error(err);
			this.loading = false;
		})
	}

	setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.propertyCount, page);
        console.log("Pager", this.pager);
        // get current page of items
        page = page-1;
        this.getUnavailableProperties(page);
        // this.pagedItems = this.unavailableProperty.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}
