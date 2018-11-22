import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IEditUserDialogData } from '../../models/dialog';
import { filter } from 'rxjs/operators';

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
	  const controls = {
      email: [
        { value: this.data.email, disabled: true },
        [Validators.required, Validators.email]
      ],
      password: [this.data.password, null],
      role: [this.data.role, Validators.required],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      phone: [this.data.phone, Validators.required]
    };

		this.editForm = this.formBuilder.group(controls);

    this.editForm.valueChanges
      .pipe(filter(() => this.editForm.valid))
      .subscribe((value: IEditUserDialogData) => {
        this.data = {...this.data, ...value};
      });
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
