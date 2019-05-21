import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PropertyTypeService } from '../../service/property-type.service';
import { PropertyService } from '../../service/property.service';
import { SweetalertService } from '../../service/sweetalert.service';
declare var $ : any;

@Component({
	selector: 'app-property-type',
	templateUrl: './property-type.component.html',
	styleUrls: ['./property-type.component.css']
})
export class PropertyTypeComponent implements OnInit {
	@ViewChild('createPropertyTypeForm') createPropertyTypeForm : NgForm;
	@ViewChild('updatePropertyTypeForm') updatePropertyTypeForm : NgForm;
	propertyType={name:'',language:'', description:''};
	Type=[];
	updateType={name:'',language:'', description:''};
	public loading = false;
	constructor(private propertyTypeSer: PropertyTypeService,
				private sweetAlertSer: SweetalertService,
				private propertySer: PropertyService) { }

	ngOnInit() {
		this.getPropertyType()
	}

	openModal(type){
		$('#updatePropertyType').modal('toggle');
		// console.log(type);
		this.updateType = type;
	}

	create(){
		// console.log(this.createPropertyTypeForm.value);
  		// this.propertyType={language:'', description:''}
  		this.propertyTypeSer
		.addPropertyType(this.createPropertyTypeForm.value)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert("Property Type Added Successfully");
			this.getPropertyType();
		},err=>{
			this.sweetAlertSer.sweetAlertError();
		})
	}

	getPropertyType(){
		this.loading = true;
		this.propertyTypeSer
		.getPropertyTypes()
		.subscribe(data =>{
			this.Type = data;
			// console.log(this.Type);
			this.loading = false;
		},err =>{
			console.error(err);
			this.loading = false;
		})
	}

	update(){
		var x = this.updatePropertyTypeForm.value;
		x['_id'] = this.updateType['_id'];
		// console.log("Update Property Data",x);
		$('#updatePropertyType').modal('toggle');
		this.propertyTypeSer
		.updatePropertyType(x)
		.subscribe(data =>{
			this.sweetAlertSer.sweetAlert(data.name +" Successfully Updated!");
			this.getPropertyType();
		},err=>{
			this.sweetAlertSer.sweetAlertError();
		})
	}
}
