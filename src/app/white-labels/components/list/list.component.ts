import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import { IWhiteLabel, IWhiteLabelQueryParams } from '../../models/white-label';
import { IConfirmDialogData } from '../../../shared/models/dialog';
import { ConfirmDialogComponent }
	from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { WhiteLabelsData } from '../../services/white-labels-data';
import { WhiteLabelsRefresh } from '../../store/actions';
import { IEditWhiteLabelDialogData } from '../../models/dialog';
import { EditWhiteLabelDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
	selector: 'wl-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class WhiteLabelsListComponent implements OnInit {
	@Input() public whiteLabels: IWhiteLabel[];
	public displayedColumns = [];
	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private store: Store<IWhiteLabelQueryParams>,
		private whiteLabelsData: WhiteLabelsData
	) {}

	public ngOnInit() {
		this.displayedColumns = ['_id', 'ip', 'controls'];
	}

	public createDataSource(whiteLabels: IWhiteLabel[]) {
		return new MatTableDataSource(whiteLabels);
	}

	public removeWL(whiteLabel: IWhiteLabel) {
		this.dialog
			.open<ConfirmDialogComponent, IConfirmDialogData>(ConfirmDialogComponent, {
				width: '580px',
				closeOnNavigation: true,
				panelClass: 'confirm-dialog-component',
				data: {
					header: 'Удаление вайт-лейбла',
					text: `Вы точно хотите удалить вайт-лейбл ${whiteLabel._id}(${whiteLabel.ip})?`
				}
			})
			.afterClosed()
			.flatMap(result => {
				if (!result) {
					return of(null);
				}

				this.snackBar.open(`Удаляем вайт-лейбл`, 'Закрыть');
				return this.whiteLabelsData.removeWL(whiteLabel);
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Вайт-лейбл удален`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(new WhiteLabelsRefresh());
					}
				},
				errorResp => {
					console.log(errorResp);
					this.snackBar.open(`Ошибки при удалении: ${errorResp.error.message}`, 'Закрыть');
				}
			);
	}

	public editWL(whiteLabel: IWhiteLabel) {
		let dialogResult: IEditWhiteLabelDialogData;
		let dialogRef = this.dialog.open<EditWhiteLabelDialogComponent, IEditWhiteLabelDialogData>(
			EditWhiteLabelDialogComponent,
			{
				width: '580px',
				closeOnNavigation: true,
				panelClass: 'edit-user-dialog-component',
				data: whiteLabel
			}
		);

		dialogRef
			.afterClosed()
			.flatMap(result => {
				if (!result) {
					return of(null);
				}
				return this.whiteLabelsData.editWL(result);
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Вайт-лейбл изменен`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(new WhiteLabelsRefresh());
					}
				},
				errorResp => {
					console.log(errorResp);
					this.snackBar.open(`Ошибки при редактировании: ${errorResp.error.message}`, 'Закрыть');
				}
			);
	}
}
