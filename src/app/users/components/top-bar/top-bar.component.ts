import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import { UsersApplyFilters } from '../../store/actions';
import { USERS_INITIAL_FILTERS_STATE } from '../../store/reducer';
import { ModuleTypes } from '../../../shared/models/ngrx-action';
import * as _ from 'lodash';
import { IUserQueryParams } from '../../models/user';

@Component({
	selector: 'users-top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
	public filters: IUserQueryParams = USERS_INITIAL_FILTERS_STATE;
  public filters$: Observable<IUserQueryParams>;

	public sortOptions = [
		{ label: 'по email', value: 'email' },
    { label: 'по дате создания', value: 'created' },
    { label: 'по роли', value: 'role' },
	];

	public searchControl = new FormControl();
	public sortControl = new FormControl();

	constructor(
		private store: Store<IUserQueryParams>
	) {}

	public ngOnInit() {
    this.filters$ = this.store.pipe(select(ModuleTypes.USERS));
    this.filters$.share().take(1).subscribe(state => {
      this.filters = _.merge(this.filters, state);
    });
		this.bindControls();
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
}
