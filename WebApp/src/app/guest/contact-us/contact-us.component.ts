import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { SweetalertService } from '../../service/sweetalert.service';

@Component({
	selector: 'app-contact-us',
	templateUrl: './contact-us.component.html',
	styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	contactForm={name:'',email:'',phone:'',message:'',captchacode:''}
	frame: HTMLElement;
	constructor(private _userService: UserService, private _sweetAlertService: SweetalertService) { }

	ngOnInit() {
	}

	handleCorrectCaptcha(event){
		console.log("Captcha response",event);
		this.contactForm['captchacode']=event;
	}

	onSubmit(){
		// this.frame = document.createElement('div');
		// this.frame.innerHTML = [
		// `<h2><strong>Hi,</strongg><br><br> I am {{contactForm.name}}</p>
		// <p>{{contactForm.msg}}</h2>
		// <p>My contact number is {{contactForm.phone}}</p>
		// <br>
		// <br>
		// <br>
		// <h4><strong>Thanks &amp; Regards,</h4><br>
		// <p>{{contactForm.name}}</p>`
		// ].join("");

		console.log(this.contactForm);

		delete this.contactForm['captchacode'];
		console.log("After Delete",this.contactForm);

		this._userService.contactUs(this.contactForm)
		.subscribe(data =>{
			this._sweetAlertService.sweetAlert("Your inquiry has been submitted!");
		},err =>{
			this._sweetAlertService.sweetAlertError();
		});
	}

}
