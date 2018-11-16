import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INewWhiteLabelDialogData } from '../../models/dialog';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'wl-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss']
})
export class EditWhiteLabelDialogComponent implements OnInit {
	public editWLForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<EditWhiteLabelDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: INewWhiteLabelDialogData,
		private formBuilder: FormBuilder
	) {}
	public ngOnInit() {
		const ipPattern =
			'(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
		this.editWLForm = this.formBuilder.group({
			ip: [
				{ value: this.data.ip },
				[Validators.required, Validators.pattern(ipPattern)]
			],
			_id: [{ value: this.data._id, disabled: true }, Validators.required]
		});

    this.editWLForm.valueChanges
      .pipe(filter(() => this.editWLForm.valid))
      .subscribe((value) => {
        this.data = {...this.data, ...value};
      });
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
