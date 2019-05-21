import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable()
export class SweetalertService {

	constructor() { }

	sweetAlert(entity){
		swal({
			position: 'center',
			type: 'success',
			title: entity,
			showConfirmButton: true,
			timer: 3000
		})
	}

	sweetAlertPropertyUploaded(){
		swal({
			type: 'error',
			title: 'Success',
			text: 'Details added successfully!',
			footer: 'Now, please place property on map & add images'
		})
	}


	sweetAlertNoFileChoosen(msg){
		swal({
			type: 'error',
			title: 'Error!',
			text: msg,
			footer: 'Please select at least one image!'
		})
	}

	sweetAlertSelectAllField(){
		swal({
			type: 'error',
			title: 'Error!',
			footer: 'Please select all the fields'
		})
	}

	verificationCodeError(status,err){
		swal({
			position: 'center',
			type: 'error',
			title: status,
			text: err,
			footer: 'Contact the Administrator!'
		})
	}

	sweetAlertError(){
		swal({
			type: 'error',
			title: 'Error!',
			text: 'Something went wrong! Please try again later'
		})
	}

	sweetAlertWrongPassword(){
		swal({
			type: 'error',
			title: 'Error!',
			text: 'Entered Password & Confirm Password does not match',
			showConfirmButton: false,
			timer: 3000
		})
	}

	authorizationError(){
		swal({
			type: 'error',
			title: 'Error!',
			text: 'You are not authorized to acces this page!'
		})
	}

}
