import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store, UPDATE } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
import { Collection } from '../../shared/abstracts/collection';
import { IWhiteLabel, IWhiteLabelQueryParams } from '../models/white-label';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { WhiteLabelsApplyFilters, WhiteLabelsPaginate } from '../store/actions';
import { ISubjectFilters } from '../../subjects/models/subject';
import { WhiteLabelsData } from '../services/white-labels-data';
import { INewWhiteLabelDialogData } from '../models/dialog';
import { CreateWhiteLabelDialogComponent }
	from '../components/create-dialog/create-dialog.component';


@Component({
	selector: 'white-labels-page',
	styleUrls: ['./white-labels.component.scss'],
	templateUrl: './white-labels.component.html'
})
export class WhiteLabelsPageComponent
	extends Collection<IWhiteLabel[], IWhiteLabelQueryParams>
	implements OnInit {
	constructor(
		private actionSubject: ActionsSubject,
		private store: Store<IWhiteLabelQueryParams>,
		private snackBar: MatSnackBar,
		private whiteLabelsData: WhiteLabelsData,
		public dialog: MatDialog
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.WHITELABELS));
		this.getWhiteLabels();
		this.actionSubjectSubscription = this.actionSubject
			.pipe( filter((action: ICustomAction) => this.actionFilter(action)) )
			.subscribe(() => {
				this.getWhiteLabels();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		const skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new WhiteLabelsPaginate(skip, this.pageSize));
	}

	public createNewWl() {
		let dialogResult: INewWhiteLabelDialogData;
		const dialogRef = this.dialog.open<
			CreateWhiteLabelDialogComponent,
			INewWhiteLabelDialogData
		>(CreateWhiteLabelDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'wl-dialog-component',
			data: {
				_id: '',
				ip: '0.0.0.0'
			}
		});

		dialogRef
			.afterClosed()
			.pipe( flatMap(result => {
				if (!result) {
					return of(null);
				}
				dialogResult = result;

				this.snackBar.open(`Создаем новый вайт-лейбл`, 'Закрыть');
				return this.whiteLabelsData.createNewWL(result);
			}) )
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Вайт-лейбл создан`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(
							new WhiteLabelsApplyFilters({ searchStr: dialogResult._id })
						);
					}
				},
				errorResp => {
					console.log(errorResp);
					this.snackBar.open(
						`Ошибки при создании: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}

	protected actionFilter(action) {
		return action.feature === ModuleTypes.WHITELABELS && action.type !== UPDATE;
	}

	private getWhiteLabels() {
		this.inProgress = true;
		this.filters$
			.pipe( flatMap(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
				const filters: ISubjectFilters = {
					searchStr: state.searchStr,
					sortBy: state.sortBy
				};
				return this.whiteLabelsData.getWhiteLabels(
					state.skip,
					state.limit,
					filters
				);
			}) )
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.whiteLabels;
			});
	}
}
