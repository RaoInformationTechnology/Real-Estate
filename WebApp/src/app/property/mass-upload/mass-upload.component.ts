import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PropertyService } from './../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';

@Component({
	selector: 'app-mass-upload',
	templateUrl: './mass-upload.component.html',
	styleUrls: ['./mass-upload.component.css']
})
export class MassUploadComponent implements OnInit {
	fileForm: FormGroup;
	upload;
	fileName;
	public loading = false;
	@ViewChild('fileInput') fileInput: ElementRef;
	constructor(private proprtySer: PropertyService, private sweetAlertSer: SweetalertService) {
		this.createForm();
	}
	
	uploadForm = new FormGroup ({
		file1: new FormControl()
	});

	filedata:any;
	fileEvent(e){
		this.filedata=e.target.files[0];
		// console.log(e);
	}


	ngOnInit() {
	}

	createForm(){
		this.fileForm = new FormGroup({
			file: new FormControl(null)
		})
	}


	fileChange1(files: any) {
		this.upload = files[0];
		this.fileName = this.upload.name;
		console.log("File Name",this.fileName);

	}
	
	onSubmit(){

		if (this.upload != undefined) {
			let file = this.upload;
    let postData = {uploadedCsv:this.upload}; // Put your form data variable. This is only example.
    this.loading = true;
    setTimeout(()=>{
    	this.loading = false;
    	this.sweetAlertSer.sweetAlert("File uploaded succesfully!");
    	this.upload = '';
    	this.fileName = '';

    }, 3000);
    this.proprtySer.massUpload(postData,file).then(result => {
    	// console.log(result);

    });
}else{ 
	this.sweetAlertSer.sweetAlert("Please select a file!");
}

}
}
