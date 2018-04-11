import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { ISubject } from '../../models/subject';
import { ITemplateFilters, ITemplateQueryParams } from '../../models/template';
import { SubjectsData } from '../../services/subjects-data';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplyFilters } from '../../store/actions/apply-filters.action';
import { INITIAL_FILTERS_STATE } from '../../store/actions/reducer';

@Component({
	selector: 'top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
	public subjects$: Observable<ISubject[]>;
	public filters: ITemplateFilters = INITIAL_FILTERS_STATE;
  public sortOptions = [
    {label: 'по id', value: '_id'},
    {label: 'по дате редактирования', value: 'dateEdit'},
    {label: 'по дате изменения gulp', value: 'lessEditHistory'},
    {label: 'по дате создания', value: 'dateCreate'},
  ];

	public searchControl = new FormControl();
	public categoryControl = new FormControl();
  public sortControl = new FormControl();

  constructor(
    private subjectsData: SubjectsData,
    private store: Store<ITemplateQueryParams>,
  ) {}

	public ngOnInit() {
		this.bindControls();
		this.subjects$ = this.subjectsData.getSubjects();
	}

	public bindControls() {
		this.searchControl.valueChanges
			.debounceTime(500)
			.skip(1)
			.distinctUntilChanged()
			.subscribe(searchValue => {
			  this.filters.searchStr = searchValue;
				this.store.dispatch(new ApplyFilters(this.filters));
			});

		this.categoryControl.valueChanges
			.distinctUntilChanged()
			.skip(1)
			.subscribe(categoryValue => {
				this.filters.selectedCategory = categoryValue;
        this.store.dispatch(new ApplyFilters(this.filters));
			});

    this.sortControl.valueChanges
      .distinctUntilChanged()
      .skip(1)
      .subscribe(sortValue => {
        this.filters.sortBy = sortValue;
        this.store.dispatch(new ApplyFilters(this.filters));
      });
	}

	public clearSearch() {
		this.searchControl.setValue('');
	}
}
