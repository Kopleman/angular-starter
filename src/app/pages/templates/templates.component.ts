import { Component, OnInit } from '@angular/core';
import { ITemplate, TemplatesData } from '../../providers/templates-data';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { FormControl } from '@angular/forms';
@Component({
	selector: 'templates-page',
	styleUrls: ['./templates.component.scss'],
	templateUrl: './templates.component.html'
})
export class TemplatesPageComponent implements OnInit {
	public templates: ITemplate[];
	public length: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;
	public searchControl = new FormControl();
	public searchStr: string = '';
	constructor(private templatesData: TemplatesData) {}

	public ngOnInit() {
		this.getTemplates(0, 10);
    this.searchControl.valueChanges.debounceTime(500)
      .distinctUntilChanged().subscribe((searchValue) => {
      this.searchStr = searchValue;
      this.pageIndex = 0;
      this.getTemplates(this.pageIndex, this.pageSize);
    });
	}

	public paginate($event: PageEvent) {
		let skip = $event.pageIndex * $event.pageSize;
		this.getTemplates(skip, $event.pageSize);
	}

  public clearSearch() {
    this.searchControl.setValue('');
  }

	private getTemplates(skip, limit) {
		this.inProgress = true;
		return this.templatesData
			.getAllTemplates(skip, limit, this.searchStr)
			.subscribe(response => {
				this.inProgress = false;
				this.length = response.count;
				this.templates = response.templates;
			});
	}
}
