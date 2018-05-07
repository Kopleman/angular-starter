import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import { ISubject } from '../../models/subject';
import { ITemplateFilters, ITemplateQueryParams } from '../../models/template';
import { SubjectsData } from '../../services/subjects-data';
import { Observable } from 'rxjs/Observable';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { ApplyFilters } from '../../store/actions';
import { INITIAL_FILTERS_STATE } from '../../store/reducer';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';
import * as _ from 'lodash';
import { AbstractFilters } from '../../../shared/abstracts/filters';

@Component({
	selector: 'top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent extends AbstractFilters<ITemplateQueryParams>
	implements OnInit {
	public subjects$: Observable<ISubject[]>;
	public filters = INITIAL_FILTERS_STATE;
	public sortOptions = [
		{ label: 'по id', value: '_id' },
		{ label: 'по дате редактирования', value: 'dateEdit' },
		{ label: 'по дате изменения gulp', value: 'lessEditHistory' },
		{ label: 'по дате создания', value: 'dateCreate' }
	];

	public searchControl = new FormControl();
	public categoryControl = new FormControl(this.filters.selectedCategory);
	public sortControl = new FormControl(this.filters.sortBy);

	constructor(
		private subjectsData: SubjectsData,
		private store: Store<ITemplateQueryParams>,
		private actionSubject: ActionsSubject
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.TEMPLATES));
		this.onInit();
		this.bindControls();
		this.subjects$ = this.subjectsData.getSubjects();
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
			control.distinctUntilChanged().subscribe(value => {
				this.filters[name] = value;
				this.store.dispatch(new ApplyFilters(this.filters));
			});
		};

		const search = this.searchControl.valueChanges.debounceTime(500);
		helper(search, 'searchStr');

		const category = this.categoryControl.valueChanges;
		helper(category, 'selectedCategory');

		const sort = this.sortControl.valueChanges;
		helper(sort, 'sortBy');
	}

	public clearSearch() {
		this.searchControl.setValue('');
	}

	protected actionFilter(action) {
		return action.feature === ModuleTypes.TEMPLATES;
	}
}
