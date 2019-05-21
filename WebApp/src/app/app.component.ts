import { Component } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AuthServices } from './auth.service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'app';
	menuShow = true;
	menu;
	constructor(private localStorageSer: LocalStorageService, private auth: AuthServices, private router: Router) {
		this.menuStatus();
	}

	menuStatus(){
		let sessionDate = sessionStorage.getItem('loginTime');
        // console.log(sessionDate);

        if (sessionDate == null ) {
        	localStorage.clear();
        	sessionStorage.clear();
        	// alert("Your session has expired!! please login again!!");
        }else{
        	var date1 = new Date(sessionDate);
        	var date2 = new Date();
        	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        	if(diffDays > 7){
        		localStorage.clear();
        		sessionStorage.clear();
        		alert("Your session has expired!! please login again!!")	
        	}else{
				this.menu = this.auth.check();
				// console.log(this.menu.value);
				if(this.menu.value == false || this.menu == undefined) {
					this.menuShow = true;
					// this.router.navigate(['']);
				}else{
					this.menuShow = true;
					// this.auth.logout();
					if (this.localStorageSer.getUserType() == 0 ) {
						// this.router.navigate(['userList']);
					}
					else if(this.localStorageSer.getUserType() == 1 ){
						this.menuShow = true;
						var id = this.localStorageSer.getUserId();
						// this.router.navigate(['userDetail/',id]);
					}
					else{
						// this.router.navigate(['']);
					}
				}
        	}
        }
	}

	openNav() {
		document.getElementById("mySidenav").style.width = "250px";
		// document.getElementById("main").style.marginRight = "250px";
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		// document.getElementById("main").style.marginLeft= "0";
	}

	onActivate(){
		window.scrollTo(0, 0);
	}

}
