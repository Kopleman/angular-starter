import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { ISubject } from '../../../providers/subjects-data';
import { ITemplateFilters } from '../../../providers/templates-data';

@Component({
	selector: 'top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
  @Input()
  public subjects: ISubject[];
  @Input()
  public filters: ITemplateFilters;

	@Output()
	public onFilterChange: EventEmitter<ITemplateFilters> = new EventEmitter();

	public searchControl = new FormControl();
	public categoryControl = new FormControl();

	public ngOnInit() {
		this.bindControls();
	}

	public bindControls() {
    this.searchControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(searchValue => {
        this.filters.searchStr = searchValue;
        this.onFilterChange.emit(this.filters);
      });

    this.categoryControl.valueChanges
      .distinctUntilChanged()
      .subscribe(categoryValue => {
        this.filters.selectedCategory = categoryValue;
        this.onFilterChange.emit(this.filters);
      });
  }

	public clearSearch() {
		this.searchControl.setValue('');
	}
}
