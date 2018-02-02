import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'top-bar',
	styleUrls: ['./top-bar.component.scss'],
	templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {
	@Output()
	public onFilterChange: EventEmitter<{
		searchStr: string;
		selectedCategory: string;
	}> = new EventEmitter();
	public searchControl = new FormControl();
	public categoryControl = new FormControl()
	public filters: {
		searchStr: string;
		selectedCategory: string;
	} = {
		searchStr: '',
		selectedCategory: 'all'
	};
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
