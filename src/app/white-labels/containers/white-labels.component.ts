import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { Collection } from '../../shared/abstracts/collection';
import { IWhiteLabel, IWhiteLabelQueryParams } from '../models/white-label';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { WhiteLabelsPaginate } from '../store/actions';
import { ISubjectFilters } from '../../subjects/models/subject';
import { WhiteLabelsData } from '../services/white-labels-data';

@Component({
	selector: 'white-labels-page',
	styleUrls: ['./white-labels.component.scss'],
	templateUrl: './white-labels.component.html'
})
export class WhiteLabelsPageComponent
	extends Collection<IWhiteLabel, IWhiteLabelQueryParams>
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
		this.filters$ = this.store.pipe(select(ModuleTypes.USERS));

		this.actionSubjectSubscription = this.actionSubject
			.filter((action: ICustomAction) => this.actionFilter(action))
			.subscribe(() => {
				this.getWhiteLabels();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		let skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new WhiteLabelsPaginate(skip, this.pageSize));
	}

	protected actionFilter(action) {
		return action.feature === ModuleTypes.WHITELABELS;
	}

	private getWhiteLabels() {
		this.inProgress = true;
		this.filters$
			.flatMap(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
				let filters: ISubjectFilters = {
					searchStr: state.searchStr,
					sortBy: state.sortBy
				};
				return this.whiteLabelsData.getWhiteLabels(
					state.skip,
					state.limit,
					filters
				);
			})
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.whiteLabels;
			});
	}
}
