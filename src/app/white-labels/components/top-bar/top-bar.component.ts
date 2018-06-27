import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable ,  Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';
import * as _ from 'lodash';
import { IUserQueryParams } from '../../models/user';
import { AbstractFilters } from '../../../shared/abstracts/filters';
import { IWhiteLabelQueryParams } from '../../models/white-label';
import { WHITELABLES_INITIAL_FILTERS_STATE } from '../../store/reducer';
import { WhiteLabelsApplyFilters } from '../../store/actions';

@Component({
	selector: 'wl-top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class WhiteLabelTopBarComponent
	extends AbstractFilters<IWhiteLabelQueryParams>
	implements OnInit {
	public filters = WHITELABLES_INITIAL_FILTERS_STATE;

	public sortOptions = [
		{ label: 'по id', value: '_id' },
		{ label: 'по ip', value: 'ip' }
	];

	public searchControl = new FormControl();
	public sortControl = new FormControl(this.filters.sortBy);
	protected actionSubjectSubscription: Subscription;

	constructor(
		private store: Store<IWhiteLabelQueryParams>,
		private actionSubject: ActionsSubject
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.WHITELABELS));
		this.onInit();
		this.bindControls();
		this.actionSubjectSubscription = this.actionSubject
			.pipe(filter((action: ICustomAction) => this.actionFilter(action)))
			.subscribe(() => {
				this.filters$.subscribe(state => {
					this.filters = _.merge(this.filters, state);
				});
			});
	}

	public bindControls() {
		const helper = (control: Observable<any>, name: string) => {
			control.pipe( distinctUntilChanged() ).subscribe(value => {
				this.filters[name] = value;
				this.store.dispatch(new WhiteLabelsApplyFilters(this.filters));
			});
		};

		const search = this.searchControl.valueChanges.pipe( debounceTime(500) );
		helper(search, 'searchStr');

		const sort = this.sortControl.valueChanges;
		helper(sort, 'sortBy');
	}

	public clearSearch() {
		this.searchControl.setValue('');
	}

	protected actionFilter(action) {
		return action.feature === ModuleTypes.WHITELABELS;
	}
}
