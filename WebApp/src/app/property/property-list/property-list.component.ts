import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { PagerService } from '../../pager.service';
import { UtilityService } from '../../utility.service';
import * as _ from 'underscore';
declare var $: any;

@Component({
	selector: 'app-property-list',
	templateUrl: './property-list.component.html',
	styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
    public loading = false;
    private sub:any;
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
    image_url;
    option;
    propertyCount;
    sortType = '1';
    constructor(private propertySer: PropertyService,  private localstorage: LocalStorageService,
        private sweetAlertSer: SweetalertService, private utilitySer: UtilityService,
        private router: Router, private pagerService: PagerService,
        private change: ChangeDetectorRef, private route: ActivatedRoute){
        this.image_url = this.utilitySer.getImageUrl();
        this.sub = this.route.params.subscribe(params => {
            this.option = params['option'];
            this.getPropertyCountByOption(this.option);
            // this.getPropertyByOption(this.option);
        });

    }

    ngOnInit() {
        this.userType = this.localstorage.getUserType();
        console.log("User Type",this.userType);
        this.getPropertyType();
        this.closeToggle();
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

    getPropertyCountByOption(option){
        console.log("Option in function:", this.option);
        this.propertySer
        .getOptionedPropertyCount(option)
        .subscribe(data =>{
            this.propertyCount = data
            console.log("count", this.propertyCount);
            this.setPage(1);
        },err =>{
            console.log("Its an Error", err);
        })
    }

    getPropertyByOption(option, pageNum){
        console.log("Option in function:", this.option);
        this.allProperty=[];
        // this.properties=[];
        this.loading = true;
        this.propertySer
        .getOptionedProperty(option, pageNum, this.sortType)
        .subscribe(data =>{
            // console.log("all Properties:", data);
            this.allProperty = data;
            // localStorage.setItem('properties', JSON.stringify(data));
            // this.newFirst();
            // this.setPage(1);
            this.loading = false;
        },err =>{
            this.loading = false;
            console.log("Its an Error", err);
        })
    }

    sort(type){
        this.sortType = type;
        // console.log("Current Pag",this.pager.currentPage);
        // this.pager.currentPage = 1;
        // this.getPropertyByAgent(this.userId, (this.pager.currentPage-1) );
        this.setPage(1);
    }

    getPropertyType(){
        this.propertySer
        .getPropertyType()
        .subscribe(data =>{
            this.propertyType = data;
            // console.log("Property Type", this.propertyType);
        },err =>{
            console.error(err);
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

    viewDetails(id){
        // console.log("property id",id);
        this.router.navigate(['propertyDetails/',id]);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        
        // get pager object from service
        this.pager = this.pagerService.getPager(this.propertyCount, page);

        // get current page of items
        page=page-1;
        this.getPropertyByOption(this.option,page);
        // this.pagedItems = this.properties.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
}

