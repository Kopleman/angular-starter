import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { Observable } from 'rxjs/Observable';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { UsersApplyFilters } from '../../store/actions';
import { USERS_INITIAL_FILTERS_STATE } from '../../store/reducer';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';
import * as _ from 'lodash';
import { IUserQueryParams } from '../../models/user';
import { Subscription } from 'rxjs/Subscription';
import { AbstractFilters } from '../../../shared/abstracts/filters';

@Component({
	selector: 'users-top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent extends AbstractFilters<IUserQueryParams>
	implements OnInit {
	public filters = USERS_INITIAL_FILTERS_STATE;

	public sortOptions = [
		{ label: 'по email', value: 'email' },
		{ label: 'по дате создания', value: 'created' },
		{ label: 'по роли', value: 'role' }
	];

	public searchControl = new FormControl();
	public sortControl = new FormControl();
	protected actionSubjectSubscription: Subscription;

	constructor(
		private store: Store<IUserQueryParams>,
		private actionSubject: ActionsSubject
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.USERS));
		this.onInit();
		this.bindControls();
		this.actionSubjectSubscription = this.actionSubject
			.filter((action: ICustomAction) => this.actionFilter(action))
			.subscribe(() => {
				this.filters$.subscribe(state => {
					this.filters = _.merge(this.filters, state);
				});
			});
	}

	public bindControls() {
		const helper = (control: Observable<any>, name: string) => {
			control
				.skip(1)
				.distinctUntilChanged()
				.subscribe(value => {
					this.filters[name] = value;
					this.store.dispatch(new UsersApplyFilters(this.filters));
				});
		};

		const search = this.searchControl.valueChanges.debounceTime(500);
		helper(search, 'searchStr');

		const sort = this.sortControl.valueChanges;
		helper(sort, 'sortBy');
	}

	public clearSearch() {
		this.searchControl.setValue('');
	}

	protected actionFilter(action) {
		return action.feature === ModuleTypes.USERS;
	}
}
