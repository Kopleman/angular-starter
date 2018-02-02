import { Component, OnInit } from '@angular/core';
import {
  ITemplate, ITemplateFilters, ITemplateQuerryParams,
  TemplatesData
} from '../../providers/templates-data';
import { PageEvent } from '@angular/material';
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
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;
	public filters: ITemplateFilters;
	constructor(private templatesData: TemplatesData) {}

  /**
   * При инициализации компонента фетчим первую страницу списка,
   * и подписываемся на изменения контрола инпута поиска
   */
	public ngOnInit() {
		this.getTemplates(0, this.pageSize);
	}

	public paginate($event: PageEvent) {
		let skip = $event.pageIndex * $event.pageSize;
		this.getTemplates(skip, $event.pageSize);
	}

  public filterCollection( filters: ITemplateFilters) {
	  this.filters = filters;
	  return this.getTemplates(0, this.pageSize);
  }

  /**
   * Получить шаблоны с бэка с задаными параметрами
   * @param skip
   * @param limit
   * @returns {Subscription}
   */
	private getTemplates(skip, limit) {
		this.inProgress = true;
		return this.templatesData
			.getTemplates(skip, limit, this.filters)
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.templates = response.templates;
			});
	}
}
