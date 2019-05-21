import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { LocalStorageService } from '../../local-storage.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { PagerService } from '../../pager.service';

@Component({
	selector: 'app-extend-pending-request',
	templateUrl: './extend-pending-request.component.html',
	styleUrls: ['./extend-pending-request.component.css']
})
export class ExtendPendingRequestComponent implements OnInit {
	public loading = false;
	expiringProperties=[];
	pager: any = {};
    pagedItems: any[];
	constructor(private _propertyService: PropertyService, private _localStorage: LocalStorageService,
				private pagerService: PagerService, private _sweetAlert: SweetalertService){
	}

	ngOnInit() {
		this.getPendingRequest();
	}

	getPendingRequest(){
		this.loading = true;
		this._propertyService
		.getRenueRequest()
		.subscribe(data =>{
			// console.log("renue request panding", data);
			this.expiringProperties = data;
			this.setPage(1);
			this.loading = false;
		},err =>{
			this._sweetAlert.sweetAlertError();
			this.loading = false;
		})
	}

	setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.expiringProperties.length, page);

        // get current page of items
        this.pagedItems = this.expiringProperties.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}
