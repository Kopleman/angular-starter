import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateDialogData } from '../../models/dialog';
import { UsersData } from '../../services/users-data';
import { IUser } from '../../models/users';
import { filter } from 'rxjs/internal/operators';

@Component({
	selector: 'create-dialog',
	templateUrl: './create-dialog.component.html',
	styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
	public templateCreateForm: FormGroup;
	public users: IUser[];
	constructor(
		public dialogRef: MatDialogRef<CreateDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ICreateDialogData,
		private formBuilder: FormBuilder,
		private userData: UsersData
	) {}

	public ngOnInit() {
		this.userData.getUsersForCloneAction().subscribe(users => {
			this.users = users;
		});
		this.templateCreateForm = this.formBuilder.group({
			templateId: [null, [Validators.required]],
			title: [null, [Validators.required]],
			selectedSubjects: [null, Validators.required],
			about: [null, null],
			author: [this.data.author, Validators.required]
		});

		this.templateCreateForm.valueChanges
			.pipe(filter(() => this.templateCreateForm.valid))
			.subscribe((value) => {
				this.data = {...this.data, ...value};
			});
	}

	public onCloseClick() {
		this.dialogRef.close();
	}
}
