import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../service/property.service';
import { UserService } from '../../service/user.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { LocalStorageService } from '../../local-storage.service';
import { PagerService } from '../../pager.service';
import { UtilityService } from '../../utility.service';
import * as _ from 'underscore';
declare var $: any;

@Component({
	selector: 'app-user-wise-property',
	templateUrl: './user-wise-property.component.html',
	styleUrls: ['./user-wise-property.component.css']
})
export class UserWisePropertyComponent implements OnInit {
	private sub : any;
	userId :  number;
	user;
	properties;
	userType;
	pager: any = {};
    pagedItems: any[];
    allProperty=[];
    image_url;
    sortType = '1';
    public loading = false;
	constructor(private propertySer: PropertyService,
        		private alertSer: SweetalertService,
        		private route: ActivatedRoute,
        		private userSer: UserService,
        		private router: Router,
                private utilitySer: UtilityService,
        		private pagerService: PagerService,
        		private localstorage: LocalStorageService) {
        this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {
		this.closeToggle();
        this.userType = this.localstorage.getUserType();
        this.sub = this.route.params.subscribe(params => {
            this.userId = params['id'];
            // console.log("User Id:", this.userId);
            this.getUser(this.userId);
            // this.getPropertyByAgent(this.userId);
        });
	}

    closeToggle(){
        $("#mini-fab").css('display', 'none');
        $("#openFab").css('display', 'block');
        $("#closeFab").css('display', 'none');
    }
    
    openToggle(){
        $("#mini-fab").css('display', 'block');
        $("#openFab").css('display', 'none');
        $("#closeFab").css('display', 'block');
    }


	getUser(id){
		this.userSer
		.getUser(id)
		.subscribe(data =>{
            console.log(data);
			this.user = data;
            this.setPage(1);
		},err =>{
			console.error(err);
		})
	}

	getPropertyByAgent(id, pageNum){

        this.loading = true;
        this.allProperty=[];
		this.propertySer.getAgentWiseProperty(id, pageNum, this.sortType)
		.subscribe(data =>{
			console.log(data);
			this.allProperty = data;
            this.loading = false;
		},err =>{
			console.error(err);
            this.loading = false;
		})
	}

    sort(type){
        this.sortType = type;
        // console.log("Current Pag",this.pager.currentPage);
        // this.pager.currentPage = 1;
        // this.getPropertyByAgent(this.userId, (this.pager.currentPage-1) );
        this.setPage(1);
    }




	setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.user.propertyCount, page);
        console.log(this.pager);

        // get current page of items
        page=page-1;
        this.getPropertyByAgent(this.userId, page);
        // this.pagedItems = this.properties.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

	viewDetails(id){
		this.router.navigate(['propertyDetails/',id]);
	}
}
