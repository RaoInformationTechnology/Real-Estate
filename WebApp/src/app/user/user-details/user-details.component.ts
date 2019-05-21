import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LocalStorageService } from '../../local-storage.service';
import { SweetalertService } from '../../service/sweetalert.service';
import { PropertyService } from '../../service/property.service';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
	private sub : any;
	userId :  number;
	user;
	userType;
	city;
	public loading = false;
	constructor(private route:ActivatedRoute,
		private userSer: UserService,
		private sweetAlertSer: SweetalertService, private propertySer: PropertyService,
		private router: Router, private localstorage: LocalStorageService) { }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.userId = params['id'];
			// console.log("User Id:", this.userId);
		});
		this.userType = this.localstorage.getUserType();
		// console.log("User Type",this.userType);
		this.getUserDetail();
	}

	getUserDetail(){
		this.loading = true;
		this.userSer
		.getUser(this.userId)
		.subscribe(data =>{
			if(data){
				this.user = data;
				console.log('User', this.user);
				this.getCityDetails(this.user.city)
			}else{
				this.user = null;
			}
			this.loading = false;
		},err =>{
			// this.sweetAlertSer.sweetAlertError();
			console.log("Its an Error", err);
			this.loading = false;
		})
	}

	getCityDetails(id){
		this.propertySer
		.getCities()
		.subscribe(data =>{
			for (var i = 0; i < data.length; i++) {
				if(id == data[i]._id){
					this.user.city = data[i];
					// console.log(this.user);
					break;
				}
			}
		},err =>{
			console.error(err);
		})
	}

	togglestatus(user){
		// console.log(user);
		if(user.userStatus == 'true'){
			user.userStatus = 'false';
			this.userSer
			.updateUser(user)
			.subscribe(data =>{
				this.sweetAlertSer.sweetAlert(this.user.firstName+" "+this.user.lastName+' is Blocked');
			},err=>{
				this.sweetAlertSer.sweetAlertError();
			})
			this.ngOnInit();
		} else if(user.userStatus == 'false'){
			user.userStatus = 'true';
			this.userSer
			.updateUser(user)
			.subscribe(data =>{
				this.sweetAlertSer.sweetAlert(this.user.firstName+" "+this.user.lastName+' is Activated');
			},err=>{
				this.sweetAlertSer.sweetAlertError();
			})
			this.ngOnInit();
		}
	}

	userPropertyDetails(){
		this.router.navigate(['/searchAgentWiseProperty',this.user._id ]);
	}
}
