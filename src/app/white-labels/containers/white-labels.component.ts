import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { Collection } from '../../shared/abstracts/collection';
import { IWhiteLabel, IWhiteLabelQueryParams } from '../model/white-label';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { WhiteLabelsPaginate } from '../store/actions';

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
		public dialog: MatDialog
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.USERS));

		this.actionSubjectSubscription = this.actionSubject
			.filter((action: ICustomAction) => this.actionFilter(action))
			.subscribe(() => {
				//
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
}
