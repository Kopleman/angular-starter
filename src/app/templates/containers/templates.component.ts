import { Component, OnInit } from '@angular/core';
import {
	ITemplate,
	ITemplateFilters,
	TemplatesData
} from '../services/templates-data';
import { PageEvent } from '@angular/material';
import { ISubject, SubjectsData } from '../services/subjects-data';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/shareReplay';

@Component({
	selector: 'templates-page',
	styleUrls: ['./templates.component.scss'],
	templateUrl: './templates.component.html'
})
export class TemplatesPageComponent implements OnInit {
	public templates: ITemplate[];
	public subjects$: Observable<ISubject[]>;
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;
	public filters: ITemplateFilters = {
    searchStr: '',
    selectedCategory: ''
  };
	constructor(
		private templatesData: TemplatesData,
		private subjectsData: SubjectsData
	) {}

	/**
	 * При инициализации компонента фетчим первую страницу списка,
	 * и словарь сабжкетов
	 */
	public ngOnInit() {
		this.getTemplates(0, this.pageSize);
		this.subjects$ = this.subjectsData.getSubjects().shareReplay(1);
	}

	public paginate($event: PageEvent) {
	  this.pageIndex = $event.pageIndex;
	  this.pageSize = $event.pageSize;
		let skip = this.pageIndex * this.pageSize;
		this.getTemplates(skip, this.pageSize);
	}

	public filterCollection(filters: ITemplateFilters) {
		this.filters = filters;
		return this.getTemplates(0, this.pageSize);
	}

	public refresh() {
    let skip = this.pageIndex * this.pageSize;
    this.getTemplates(skip, this.pageSize);
  }

	/**
	 * Получить шаблоны с бэка с задаными параметрами
	 * @param skip
	 * @param limit
	 */
	private getTemplates(skip, limit) {
		this.inProgress = true;
		this.templatesData
			.getTemplates(skip, limit, this.filters)
      .first()
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.templates = response.templates;
			});
	}
}
