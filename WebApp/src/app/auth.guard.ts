import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthServices } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { SweetalertService } from './service/sweetalert.service';


@Injectable()
export class LoginGuard implements CanActivate {
	constructor(private authService: AuthServices, private router: Router){

	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		let loginGard:any = this.authService.check();
		if(loginGard.value === true) {
			return loginGard;
		}else{
			this.router.navigate(['/login']);
			return loginGard;			
		}

	}
}

@Injectable()
export class AdminGuard implements CanActivate {

	constructor(private authService: AuthServices,private localStorageService: LocalStorageService,
		private router: Router, private sweetAlertService: SweetalertService){

	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		let guard:any = this.authService.check();
		// console.log("Guard", guard); 
		if(guard.value === true){
			if (this.localStorageService.getUserType() == 0) {
				return true;
			}else{
				this.sweetAlertService.authorizationError();
				this.router.navigate(['/']);
				return false;
			}
		}else{
			this.router.navigate(['/login']);
			return false;
		}

	}
}

@Injectable()
export class AgentGuard implements CanActivate {

	constructor(private authService: AuthServices,private localStorageService: LocalStorageService,
		private router: Router, private sweetAlertService: SweetalertService){

	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		let guard:any = this.authService.check();
		// console.log("Guard", guard); 
		if(guard.value === true){
			if (this.localStorageService.getUserType() == 1) {
				// console.log(this.localStorageService.getUserStatus());
				if(this.localStorageService.getUserStatus() === 'true'){
					return true;
				}else{
					this.sweetAlertService.authorizationError();
					this.router.navigate(['/']);
					return false;	
				}
			}else if(this.localStorageService.getUserType() == 0){
				return true;
			}
		}else{
			this.router.navigate(['/login']);
			return false;
		}
	}
}

@Injectable()
export class SignupGuard implements CanActivate {

	constructor(private authService: AuthServices,private localStorageService: LocalStorageService,
		private router: Router, private sweetAlertService: SweetalertService){

	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if(localStorage.getItem('signedupUser')){
			return true;
		}
	}
}

@Injectable()
export class PropertyTypeGuard implements CanActivate {
	private sub;
	private option;
	constructor(private authService: AuthServices,private localStorageService: LocalStorageService,
		private router: Router, private sweetAlertService: SweetalertService, private route: ActivatedRoute){
		this.sub = this.route.params.subscribe(params => {
            this.option = params['option'];
        });
	}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		let guard:any = this.authService.check();
		// console.log("Guard", guard); 
		if(guard.value === true){
			if (this.localStorageService.getUserType() == 1) {
				if(this.option == 'available'){
					return true;
				}else{
					this.sweetAlertService.authorizationError();
					// this.router.navigate(['/']);
					return false;
				}
			}else if(this.localStorageService.getUserType() == 0){
				return true;
			}
		}else{
			this.router.navigate(['/login']);
			return false;
		}

	}
}
