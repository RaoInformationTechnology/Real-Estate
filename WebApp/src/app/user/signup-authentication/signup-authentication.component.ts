import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { SweetalertService } from '../../service/sweetalert.service';

@Component({
	selector: 'app-signup-authentication',
	templateUrl: './signup-authentication.component.html',
	styleUrls: ['./signup-authentication.component.css']
})
export class SignupAuthenticationComponent implements OnInit {
	private sub;
	_id;
	randomCode;
	user;
	constructor(private route: ActivatedRoute, private userSer: UserService,
		private sweetAlertSer: SweetalertService,private router: Router) {
		this.sub = this.route.params.subscribe(params => {
			this._id = params['id'];
			// console.log("User Id:", this._id);
		});
	}

	ngOnInit() {
		this.userSer
		.getUser(this._id)
		.subscribe(data =>{
			this.user=data
			// console.log(this.user);
		},err =>{
			console.error(err);
		})

		document.getElementById('demo').innerHTML = '5' + ":" + '00';
		this.startTimer();
	}

	startTimer(){
		var presentTime = document.getElementById('demo').innerHTML;
		var timeArray:any = presentTime.split(/[:]+/);
		// console.log(timeArray);
		var m = timeArray[0];
		// console.log(m);
		var s = this.checkSecond((timeArray[1] - 1));
		if(s==59){m=m-1}
		if(m<0){alert('timer completed')}
		  
		document.getElementById('demo').innerHTML =	m + ":" + s;
		setTimeout(this.startTimer, 1000);
	}

	checkSecond(sec):number {
	  	if (sec < 10 && sec >= 0){
	  		sec = "0" + sec;
	  		return sec;
	  	} else if (sec < 0){
	  		sec = 59;
	  		return sec;
	  	} else {
	  		return sec;
	  	}
	}

	getNewCode(){
		// console.log("Func called");
		let user = {_id:this._id}
		this.userSer
		.getNewVerificationCode(user)
		.subscribe(data =>{
			// console.log("New Code",data);
		},err =>{
			console.error(err);
		})
	}

	verify(){
		let user = {_id:this._id,
			randomCode: this.randomCode};
			if (user.randomCode != "" && user.randomCode != undefined) {
				this.userSer
				.verifyUser(user)
				.subscribe(data =>{
					// console.log("Verification:", data);
					// this.sweetAlertSer.sweetAlert("Yor email has been verified .!");
					this.router.navigate(['/login'])
				},err =>{
					console.error(err);
					if(err.status === 401){
						this.sweetAlertSer.verificationCodeError(err.statusText,'Your verification code has expired!');
					}
					if(err.status === 400){
						this.sweetAlertSer.verificationCodeError(err.statusText,'Your verification code is incorrect!');
					}
				});
			} else {
				this.sweetAlertSer.verificationCodeError('Error!','Please enter verification code');
			}
		}

	}
