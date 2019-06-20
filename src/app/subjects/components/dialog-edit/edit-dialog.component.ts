import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WhiteLabelsData } from '../../../shared/services/whitelabels-data';
import { IWhiteLabel } from '../../../shared/models/whitelabel';
import { ISubject } from '../../models/subject';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'subject-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss']
})
export class SubjectEditDialogComponent implements OnInit {
	public editForm: FormGroup;
	public whiteLabels: IWhiteLabel[];
	constructor(
		public dialogRef: MatDialogRef<SubjectEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {
			subject: ISubject,
			selectedWhiteLabel: string
		},
		private formBuilder: FormBuilder,
		private whiteLabelsData: WhiteLabelsData
	) {}

	public ngOnInit() {
		const controls = {
			selectedWhiteLabel: [this.data.selectedWhiteLabel, null]
		};
		this.editForm = this.formBuilder.group(controls);
		this.whiteLabelsData.getWhiteLabels().subscribe(wls => {
			this.whiteLabels = wls;
		});

    this.editForm.valueChanges
      .pipe(filter(() => this.editForm.valid))
      .subscribe((value) => {
        this.data = {...this.data, ...value};
      });
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
