import { Component, Input, OnInit } from '@angular/core';
import { ISubject } from '../../models/subject';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { SubjectEditDialogComponent } from '../dialog-edit/edit-dialog.component';
import { ISubjectEditDialogData } from '../../models/dialog';
import { of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { SubjectsData } from '../../services/subjects-data';

@Component({
	selector: 'subjects-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class SubjectsListComponent implements OnInit {
	@Input() public subjects: ISubject[];
	public displayedColumns = [];

	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private subjectsData: SubjectsData
	) {}

	public ngOnInit() {
		this.displayedColumns = ['_id', 'title', 'controls'];
	}

	public createDataSource(subjects: ISubject[]) {
		return new MatTableDataSource(subjects);
	}

	public editSubject(subject: ISubject) {
		let dialogResult: ISubjectEditDialogData;
		const dialogRef = this.dialog.open<
			SubjectEditDialogComponent,
			ISubjectEditDialogData
		>(SubjectEditDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'properties-dialog-component',
			data: {
				subject,
				selectedWhiteLabel: subject.whitelabelsIds.length
					? subject.whitelabelsIds[0]
					: ''
			}
		});

		dialogRef
			.afterClosed()
			.pipe( flatMap(result => {
				if (!result) {
					return of(null);
				}
				dialogResult = result;
				console.log(dialogResult);
				result.subject.whitelabelsIds = [result.selectedWhiteLabel];
				this.snackBar.open(`Сохраняем изменения`, 'Закрыть');
				return this.subjectsData.saveChanges(result.subject);
			}))
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Сохранено`, 'Закрыть', {
							duration: 2000
						});
						subject = dialogResult.subject;
					}
				},
				errorResp => {
					this.snackBar.open(
						`Произошла ошибка при сохранение: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}
}
