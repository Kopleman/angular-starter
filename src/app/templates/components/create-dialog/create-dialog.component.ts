import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateDialogData } from '../../models/dialog';

@Component({
	selector: 'create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
	public templateCreateForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<CreateDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ICreateDialogData,
		private formBuilder: FormBuilder
	) {}

	public ngOnInit() {
		this.templateCreateForm = this.formBuilder.group({
			templateId: [null, [Validators.required]],
			title: [null, [Validators.required]],
			selectedSubject: [null, Validators.required],
			about: [null, null]
		});
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
