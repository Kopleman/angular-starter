import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEditUserDialogData } from '../../models/dialog';

@Component({
	selector: 'user-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
	public editForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<EditUserDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: IEditUserDialogData,
		private formBuilder: FormBuilder
	) {}
	public ngOnInit() {
	  let data = this.data;
		this.editForm = this.formBuilder.group({
			email: [{value: data.email, disabled: true}, [Validators.required, Validators.email]],
			password: [{value: data.password}, null],
			role: [{value: data.role}, Validators.required],
			firstName: [{value: data.firstName}, Validators.required],
			lastName: [{value: data.lastName}, Validators.required],
			phone: [{value: data.phone}, Validators.required]
		});
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
