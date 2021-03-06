import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateUserDialogData } from '../../models/dialog';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'user-create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
	public createForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<CreateUserDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ICreateUserDialogData,
		private formBuilder: FormBuilder
	) {}
	public ngOnInit() {
		this.createForm = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, Validators.required],
			role: [null, Validators.required],
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			phone: [null, Validators.required]
		});

    this.createForm.valueChanges
      .pipe(filter(() => this.createForm.valid))
      .subscribe((value) => {
        this.data = {...this.data, ...value};
      });
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
