import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { ISubjectQueryParams } from '../../models/subject';
import { ITemplateFilters, ITemplateQueryParams } from '../../models/template';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubjectsApplyFilters } from '../../store/actions';
import { SUBJECTS_INITIAL_FILTERS_STATE } from '../../store/reducer';

@Component({
	selector: 'subjects-top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
	public filters: ISubjectQueryParams = SUBJECTS_INITIAL_FILTERS_STATE;
	public sortOptions = [
		{ label: 'по id', value: '_id' },
		{ label: 'по имени', value: 'title' },
	];

	public searchControl = new FormControl();
	public sortControl = new FormControl();

	constructor(
		private store: Store<ISubjectQueryParams>
	) {}

	public ngOnInit() {
		this.bindControls();
	}

	public bindControls() {
		const helper = (control: Observable<any>, name: string) => {
			control
				.skip(1)
				.distinctUntilChanged()
				.subscribe(value => {
					this.filters[name] = value;
					this.store.dispatch(new SubjectsApplyFilters(this.filters));
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
