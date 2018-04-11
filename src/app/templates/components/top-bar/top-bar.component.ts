import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';
import { ISubject } from '../../models/subject';
import { ITemplateFilters } from '../../models/template';
import { SubjectsData } from '../../services/subjects-data';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
	public subjects$: Observable<ISubject[]>;
	@Input()
	public filters: ITemplateFilters = {
		searchStr: '',
		selectedCategory: '',
		sortBy: '_id'
	};
  public sortOptions = [
    {label: 'по id', value: '_id'},
    {label: 'по дате редактирования', value: 'dateEdit'},
    {label: 'по дате изменения gulp', value: 'lessEditHistory'},
    {label: 'по дате создания', value: 'dateCreate'},
  ];
	@Output()
	public onFilterChange: EventEmitter<ITemplateFilters> = new EventEmitter();

	public searchControl = new FormControl();
	public categoryControl = new FormControl();
  public sortControl = new FormControl();

  constructor(
    private subjectsData: SubjectsData
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
				this.onFilterChange.emit(this.filters);
			});

		this.categoryControl.valueChanges
			.distinctUntilChanged()
			.skip(1)
			.subscribe(categoryValue => {
				this.filters.selectedCategory = categoryValue;
				this.onFilterChange.emit(this.filters);
			});

    this.sortControl.valueChanges
      .distinctUntilChanged()
      .skip(1)
      .subscribe(sortValue => {
        this.filters.sortBy = sortValue;
        this.onFilterChange.emit(this.filters);
      });
	}

	public clearSearch() {
		this.searchControl.setValue('');
	}
}
