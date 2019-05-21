import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angular5-social-login';
import { FacebookService, InitParams } from 'ngx-facebook';
import { SweetalertService } from '../service/sweetalert.service';
import { UserService } from '../service/user.service';
import { AuthServices } from '../auth.service';
import { Router } from '@angular/router';
declare var	$ : any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	@ViewChild('loginForm') loginForm : NgForm;
	passwordForm: FormGroup;
	password;
	cpassword;
	loginDetails = {email: '',password: ''};
	public loading = false;
	user={facebookId:'',firstName:'',lastName:'',email:'', password:''};
	constructor(private socialAuthService: AuthService,
		private sweetAlertSer: SweetalertService,
		private fb: FacebookService,private userSer: UserService,private  router:Router, private auth: AuthServices) {
		window.addEventListener('load', function() {
			var forms = document.getElementsByClassName('needs-validation');
			var validation = Array.prototype.filter.call(forms, function(form) {
				form.addEventListener('submit', function(event) {
					if (form.checkValidity() === false) {
						event.preventDefault();
						event.stopPropagation();
					}
					form.classList.add('was-validated');
				}, false);
			});
		}, false);

		let initParams: InitParams = {
			appId: '1977606375586139',
			xfbml: true,
			version: 'v2.12'
		};
		fb.init(initParams);
		this.createPasswordForm();
	}

	createPasswordForm(){
		this.passwordForm = new FormGroup({
			email : new FormControl("", Validators.required),
			password : new FormControl("", Validators.required),
			newPassword : new FormControl("", Validators.required),
			confirmNewPassword : new FormControl("", Validators.required)
		});
	}

	ngOnInit() {
	}

	changePassword(passwordForm){
		// console.log(passwordForm);
		if(passwordForm.newPassword === passwordForm.confirmNewPassword){
			delete passwordForm['confirmNewPassword']
			this.userSer.changePassword(passwordForm)
			.subscribe(data =>{
				// console.log("password changed");
				this.sweetAlertSer.sweetAlert("Password Updated Successfully");
				this.passwordForm.reset();
			},err =>{
				console.error(err);
				this.sweetAlertSer.sweetAlertError();
				this.passwordForm.reset();
			})
		}else{
			this.sweetAlertSer.sweetAlertError();
			this.passwordForm.reset();
		}
	}

	openModel(){
		$('#passwordModal').modal('show');
	}

	doLogin(){
		this.loading = true;
		// console.log(this.loginDetails);
		this.userSer
		.login(this.loginDetails)
		.subscribe(data =>{	
			if (data.user != undefined) {
				localStorage.setItem('user', JSON.stringify(data.user));
				localStorage.setItem('token', JSON.stringify(data.token));
				this.auth.login();
				window.location.reload();
				this.router.navigate([''])//data.user._id
			}
			else if(data.admin != undefined){
				localStorage.setItem('admin', JSON.stringify(data.admin));
				localStorage.setItem('token', JSON.stringify(data.token));
				this.auth.login();
				this.router.navigate(['']);
				window.location.reload();
			}
			else{
				this.loginDetails = {email: '', password: ''	};
			}
			this.loading = false;
		},err=>{
			this.loading = false;
			this.sweetAlertSer.sweetAlertError();
		})
	}

	public socialSignIn(socialPlatform : string) {
		let socialPlatformProvider;
		if(socialPlatform == "facebook"){
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
		}else if(socialPlatform == "google"){
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		}
		this.socialAuthService.signIn(socialPlatformProvider)
		.then((userData) => {
			// console.log(socialPlatform+" sign in data : " , userData);
			this.user={facebookId:userData.id,
						firstName: userData.name.split(' ').slice(0, -1).join(' '),
						lastName: userData.name.split(' ').slice(-1).join(' '),
						email: userData.email,
						password:''};
						// console.log(this.user);
			this.loading = true;
			this.getAvailability(this.user.facebookId);
		});
	}

	getAvailability(id){
		this.userSer.getAvailability(id)
		.subscribe(data =>{
			// console.log(data);
			if(data.avilable == false){
				this.loading = false;
				$('#enterpasswordModal').modal('toggle');
			}else if(data.avilable == true){
				this.userSer.fbLogin(this.user)
				.subscribe(data =>{
					if (data.user != undefined) {
						localStorage.setItem('user', JSON.stringify(data.user[0]));
						localStorage.setItem('token', JSON.stringify(data.token));
						this.auth.login();
						this.loading = false;
						window.location.reload();
						this.router.navigate([''])
					}
				},err =>{
					console.error(err);
				})
			}
		},err =>{
			console.error(err);
		})
	}

	savePassword(){
		this.loading = true;
		this.user.password = this.password;
		// console.log(this.user);
		this.password = "";
		this.cpassword = "";
		$('#enterpasswordModal').modal('toggle');
		this.user['userStatus'] = 'false';
		this.userSer.signUp(this.user)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert('User Signed up successfully!');
			localStorage.setItem("signedupUser", JSON.stringify(data));
			this.router.navigate(['/signup/authentication/', data._id]);
			this.loading = false;
		},err=>{
			this.loading = false;
			this.sweetAlertSer.sweetAlertError();
		})
	}
}
