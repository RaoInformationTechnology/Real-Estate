import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { AuthServices } from '../auth.service';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	menuShow = true;
	role;
	userId;
	firstName = 'ADMIN';
	authDetails;
	userStatus;
	constructor(private router:Router,private localstorage: LocalStorageService, private auth: AuthServices) {
	}
	ngOnInit() {
		$(window).on('load',function(){
			$("#logo-text").addClass('animated zoomInLeft')
			$("#header-logo").addClass('animated flipInY')
		});

		var currentMode;
		$(document).ready(function(){
			caliberateScreen();
			adjustLogoTextSize();

		 // console.log("HEIGHT OF TOP HEADER = ",$("#header-big-whole").height())

			$(window).resize(function(){
				caliberateScreen();
				adjustLogoTextSize();

			});
			$(window).scroll(function(){
				if(inArray(currentMode,['sm','xs'])){ 
					 // console.log("Current mode is "+currentMode+" so returning without header animation");
					return;
				}
				else{
					var pos = $(window).scrollTop();
					// console.log("Position", pos, $("#header-big-whole").height());
					if(pos < $("#header-big-whole").height())
						showBigHeader();
					else
						showSmallHeader();
				}
			})


			function adjustLogoTextSize(){
				 // console.log("Adjusting Logo Text size for ",currentMode);
				var finalSize = '24px';

				if(currentMode == 'xs'){
					finalSize = '24px'
				}
				else if(currentMode == 'sm'){
					finalSize = '36px'
					$("#header-logo").css({
						'height' : 100
					})
				}
				else{
					finalSize = '48px'
				}

				 // console.log("Logo Text Size is ",finalSize);
			}

			function caliberateScreen(){
				var width = $(window).width();

				if(width < 544){
					currentMode = 'xs';
				}
				else if((width >= 544) && (width < 740)){
					currentMode = 'sm';
				}
				else if((width >= 741) && (width < 992)){
					currentMode = 'md';
				}
				else{
					currentMode = 'lg';
				}
                                // console.log("Current Mode", currentMode);

			}

			function inArray(needle, haystack) {
                // console.log("inArray Called");
				var length = haystack.length;
				// console.log("length", );
				for(var i = 0; i < length; i++) {
					if(haystack[i] == needle)
						return true;
				}
				return false;
			}
			function showBigHeader(){
                // console.log("Big Menu");
				$(".header-big-whole").show('slow');
				$(".header-small-item").hide('fast');
                $("#home-desktop").css({
					'height' : '200px',
					'margin-bottom': '50px'
				});
				$(".header-big-whole").css({
					'height': '175px',
					'margin-top': '50px'
				})
				$("#desktop-nav").css({
					'padding-top' : '5px',
				})

				$("#header-small-row").css({
					'position': 'relative',
					'top': '0px',
					'height' : '50px'
				})
                               
			}



			function showSmallHeader(){
				$(".header-small-item").show('slow');
				$(".header-big-whole").hide('fast')
				$("#header-small-row").css({
					'position': 'fixed',
					'top': '50px',
					'height' : '100px'
				})
				$("#desktop-nav").css({
					'padding-top' : '2em'
				})

			}
		});


		this.role = this.localstorage.getUserType();
		this.authDetails = this.auth.check();
		if (this.role == 1) {
			this.firstName = this.localstorage.getUserFirstName();
			console.log(this.firstName);
			this.userStatus = this.localstorage.getUserStatus();
			console.log("User Status", this.userStatus);
		}
		this.shownav(this.role);
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		// document.getElementById("main").style.marginRight= "0";
		
	}

	logOutUser(){
		this.closeNav();
		if (this.role == 0 ) {
			localStorage.removeItem('admin');
			localStorage.removeItem('token');

			this.auth.logout();
			window.location.reload();

		}
		else{
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			this.auth.logout();
			window.location.reload();

		}
		this.router.navigate([""]);
	}

	userProperty(){
		this.closeNav();
		this.userId = this.localstorage.getUserId();
		this.router.navigate(["/searchAgentWiseProperty",this.userId]);
	}

	updateProfile(){
		this.closeNav();
		this.userId = this.localstorage.getUserId();
		this.router.navigate(["/userUpdate",this.userId]);
	}

	userProfile(){
		this.closeNav();
		this.userId = this.localstorage.getUserId();
		this.router.navigate(["/userDetail",this.userId]);
	}

	buyOrRent(type){
		this.closeNav();
		this.router.navigate(["/property",type]);
	}

	navigateToPropertyList(option){
		this.router.navigate(['propertyList/', option]);
	}

	shownav(role){
		this.menuShow = true;
		// role 1 -> User
		// role 0 -> Admin
		if (this.role == 1){
			$(".home").css('display', 'inline-block');
			$(".buy").css('display', 'inline-block');
			$(".rent").css('display', 'inline-block');	
			$(".aboutUs").css('display', 'inline-block');	
			$(".users").css('display', 'none');
			$(".addNewProperty").css('display', 'inline-block');
			$(".addNewPropertyType").css('display', 'none');
			$(".searchProperty").css('display', 'none');
			$(".allProperty").css('display', 'inline-block');
			$(".ownProfile").css('display', 'inline-block');
			$(".profile").css('display', 'inline-block');
			$(".massUpload").css('display', 'none');
			$(".login").css('display', 'none');
			$(".search").css('display', 'inline-block');
			$(".contactUs").css('display', 'inline-block');
			$(".listingConformation").css('display', 'none');
			$(".unavailableProperty").css('display', 'none');
			$(".expiringProperties").css('display', 'inline-block');
			$(".pendingRequest").css('display', 'none');
			$(".properties").css('display', 'none');
			$(".profile").css('display', 'inline-block');
			$('.myProfile').css('display','inline-block');
			$(".soldProperty").css('display', 'none');
			$(".rentedProperty").css('display', 'none');
			$(".addNewUser").css('display', 'none');
		}
		else if(this.role == 0){
			$(".home").css('display', 'inline-block');
			$(".buy").css('display', 'inline-block');
			$(".rent").css('display', 'inline-block');		
			$(".aboutUs").css('display', 'inline-block');
			$(".users").css('display', 'inline-block');
			$(".addNewProperty").css('display', 'inline-block');
			$(".addNewPropertyType").css('display', 'inline-block');
			$(".searchProperty").css('display', 'inline-block');
			$(".allProperty").css('display', 'inline-block');
			$(".ownProfile").css('display', 'none');
			$(".profile").css('display', 'none');
			$(".massUpload").css('display', 'inline-block');
			$(".login").css('display', 'none');
			$(".search").css('display', 'none');
			$(".contactUs").css('display', 'inline-block');
			$(".listingConformation").css('display', 'inline-block');
			$(".unavailableProperty").css('display', 'inline-block');
			$(".expiringProperties").css('display', 'none');
			$(".pendingRequest").css('display', 'inline-block');
			$(".properties").css('display', 'inline-block');
			$(".userProfile").css('display', 'none');
			$('.myProfile').css('display','inline-block');
			$(".soldProperty").css('display', 'inline-block');
			$(".rentedProperty").css('display', 'inline-block');
			$(".addNewUser").css('display', 'none');
		}
		else{
			this.role = 2;
			this.firstName = "Guest";

			$(".login").css('display', 'inline-block');
			$(".logout").css('display', 'none');
			$(".search").css('display', 'inline-block');
			$(".home").css('display', 'inline-block');
			$(".buy").css('display', 'inline-block');
			$(".rent").css('display', 'inline-block');
			$(".contactUs").css('display', 'inline-block');
			$(".aboutUs").css('display', 'inline-block');					
			$(".properties").css('display', 'none');
			$(".users").css('display', 'none');
			$(".addNewProperty").css('display', 'none');
			$(".addNewPropertyType").css('display', 'none');
			$(".searchProperty").css('display', 'none');
			$(".allProperty").css('display', 'none');
			$(".ownProfile").css('display', 'none');
			$(".massUpload").css('display', 'none');	
			$(".listingConformation").css('display', 'none');
			$(".unavailableProperty").css('display', 'none');
			$(".expiringProperties").css('display', 'none');
			$(".pendingRequest").css('display', 'none');
			$('.myProfile').css('display','none');
			$(".soldProperty").css('display', 'none');
			$(".rentedProperty").css('display', 'none');
			$(".addNewUser").css('display', 'none');
			
		}
	}
}