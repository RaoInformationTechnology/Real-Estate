import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../service/property.service';
import { UserService } from '../../service/user.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { LocalStorageService } from '../../local-storage.service';
import { UtilityService } from '../../utility.service';
declare var $: any;
@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
	private sub : any;
	propertyId :  number;
	property;
	agent;
	userType;
	userId;
	zoom: number = 8;
	lat: number = null;
	lng: number = null;
	image_url;
	public loading = false;
	date;
	PublicationDate;
	expiryDate;
	constructor(private route:ActivatedRoute,
		private proprtySer: PropertyService,
		private userSer: UserService,
		private router: Router,
		private utilitySer: UtilityService,
		private sweetAlertSer: SweetalertService,
		private localstorage: LocalStorageService) { 
		$('.carousel').carousel();
		this.image_url = this.utilitySer.getImageUrl();
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.propertyId = params['id'];
			// console.log("Property Id:", this.propertyId);
		});
		this.userType = this.localstorage.getUserType();
		console.log("User Type: ",this.userType);
		if (this.userType == 1) {
			this.userId = this.localstorage.getUserId();
		}
		this.getPropertyDetail(this.propertyId);
	}

	varifyProperty(property){
		if(this.userType == 0){
			this.loading = true;
			this.proprtySer
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
	}

	getPropertyDetail(id){
		this.loading = true;
		this.proprtySer
		.getProperty(this.propertyId)
		.subscribe(data =>{
			console.log("get properties details=========<<",data);
			if (data.length == 1) {
				// console.log("response length", data.length);
				$("#property").css('display', 'block');
				$("#noProperty").css('display', 'none');
				this.property = data[0];
				console.log("Property", this.property);
				this.lat = Number(this.property.lat);
				this.lng = Number(this.property.lon);

				this.date = new Date(this.property.createdAt);
				this.expiryDate=new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate()+90).toDateString();
				this.PublicationDate = new Date(this.date.getFullYear(),this.date.getMonth(),this.date.getDate()).toDateString();
				console.log(this.date);
				console.log(this.expiryDate);
				this.loading = false;
			}
			else{
				$("#property").css('display', 'none');
				$("#noProperty").css('display', 'block');
				this.loading = false;

			}
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	togglestatus(property,status){
		this.loading = true;
		property.status == status;
			this.proprtySer
			.changePropertyStatus(property._id,status)
			.subscribe(data =>{
				this.sweetAlertSer.sweetAlert('Property status change to :'+status);
				this.ngOnInit();
				this.loading = false;
			},err=>{
				this.sweetAlertSer.sweetAlertError();
				this.loading = false;
			})

		// } else if(property.status == 'Unavailable'){
		// 	status = 'Available';
		// 	this.proprtySer
		// 	.changePropertyStatus(property._id,status)
		// 	.subscribe(data =>{
		// 		this.sweetAlertSer.sweetAlert('Property Activated');
		// 		this.ngOnInit();
		// 		this.loading = false;
		// 	},err=>{
		// 		this.sweetAlertSer.sweetAlertError();
		// 		this.loading = false;
		// 	})
		// }
	}
	update(property){
		// console.log(property._id);
		this.router.navigate(['updateProperty/', property._id]);
	}


	deleteProperty(id){
		this.loading=true;
		this.proprtySer
		.deleteProperty(id)
		.subscribe(data =>{
			$("#property").css('display', 'none');
			$("#noProperty").css('display', 'block');
			this.sweetAlertSer.sweetAlert("Property deleted successfully!");
			this.loading=false;
		},err =>{
			this.sweetAlertSer.sweetAlertError();
			this.loading=false;
		})
	}
	
}