import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INewWhiteLabelDialogData } from '../../models/dialog';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'wl-create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateWhiteLabelDialogComponent implements OnInit {
	public createWLForm: FormGroup;
	constructor(
		public dialogRef: MatDialogRef<CreateWhiteLabelDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: INewWhiteLabelDialogData,
		private formBuilder: FormBuilder
	) {}
	public ngOnInit() {
		const ipPattern =
			'(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
		this.createWLForm = this.formBuilder.group({
			ip: [null, [Validators.required, Validators.pattern(ipPattern)]],
			_id: [null, Validators.required]
		});

    this.createWLForm.valueChanges
      .pipe(filter(() => this.createWLForm.valid))
      .subscribe((value) => {
        this.data = {...this.data, ...value};
      });
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
