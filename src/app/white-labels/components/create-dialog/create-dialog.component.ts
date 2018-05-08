import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INewWhiteLabelDialogData } from '../../models/dialog';

@Component({
	selector: 'wl-create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateWhiteLabelDialogComponent implements OnInit {
	public createForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<CreateWhiteLabelDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: INewWhiteLabelDialogData,
		private formBuilder: FormBuilder
	) {}
	public ngOnInit() {
		const ipPattern =
			'(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
		this.createForm = this.formBuilder.group({
			ip: ['0.0.0.0', Validators.required, Validators.pattern(ipPattern)],
			host: [null, Validators.required],
		});
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
