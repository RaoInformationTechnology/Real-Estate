	import { Component, OnInit } from '@angular/core';
	import { UserService } from '../../service/user.service';
	import { SweetalertService } from '../../service/sweetalert.service';
	import { Router } from '@angular/router';
	declare var $: any;
	@Component({
		selector: 'app-user-list',
		templateUrl: './user-list.component.html',
		styleUrls: ['./user-list.component.css']
	})
	export class UserListComponent implements OnInit {
		users=[];
		allusersList;
		allUsers = [];
		filteredItems;
		searchText="";
		filteredUser=[];
		j=0;
		public loading = false;
		constructor(private userSer: UserService,
			private sweetAlertSer: SweetalertService,private router:Router) { }

		ngOnInit() {
			this.getUsers();
		}

		getUsers(){
			this.loading = true;
			this.userSer
			.getUsers()
			.subscribe(data =>{
				// console.log(data);
				this.allUsers = data;
				// this.allusersList = data;
				// for(var i=0; i < data.length; i++){
				// 	this.users[i] = data[i].firstName+" "+data[i].lastName;
				// }
				this.loading = false;
			},err =>{
				console.error(err);
				this.loading = false;
			})
		}

		// assignCopy(){
		// 	this.filteredItems = Object.assign([], this.users);
		// 	this.allUsers = this.allusersList
		// }
		// filterItem(){
		// 	if(!this.searchText){
		// 		this.assignCopy(); 
		// 	}else if(this.searchText){
		// 		console.log(this.searchText);
		// 		this.filteredItems = Object.assign([], this.users).filter(
		// 			item => item.toString().toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
		// 			)
		// 		this.filteredUser=[];
		// 		this.j=0;
		// 		for(var i=0; i<this.allusersList.length;i++){
		// 			if(this.filteredItems[this.j] == this.allusersList[i].firstName+" "+this.allusersList[i].lastName){
		// 				this.filteredUser[this.j] = this.allusersList[i];
		// 				this.j++;
		// 			}
		// 		}
		// 		this.allUsers = this.filteredUser;
		// 	}

		// 	if(this.filteredUser.length <= 0){

		// 	}

		// }

		viewDetails(id){
			// console.log(id);
			this.router.navigate(['userDetail/',id]);
		}
	}
