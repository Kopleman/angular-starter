import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { ITemplate, ITemplateFilters, TemplatesData } from '../../../providers/templates-data';
import { ISubject } from '../../../providers/subjects-data';
import { MatSlideToggleChange } from '@angular/material';

@Component({
	selector: 'templates-list-item',
	styleUrls: ['./list-item.component.scss'],
	templateUrl: './list-item.component.html'
})
export class TemplateListItemComponent {
	@Input() public subjects: ISubject[];
	@Input() public template: ITemplate;
  @Output()
  public onFilterChange: EventEmitter<ITemplateFilters> = new EventEmitter();
	constructor(private templatesData: TemplatesData) {}

	public getTemplateType() {
		return this.template.sourceTemplate === 'none' ? 'parent' : 'clone';
	}

	public getTempalteLangs() {
		return Object.keys(this.template.i18nTitles);
	}

	public filterByName(name) {
	  console.log(name);
    this.onFilterChange.emit({searchStr: name, selectedCategory: ''});
  }
  /**
   * Обработчик тригера слайдера гулп-статуса
   * @param {MatSlideToggleChange} $event
   */
	public changeGulpStatus($event: MatSlideToggleChange) {
		this.templatesData
			.changeGulpStatus(this.template._id, $event.checked ? 'restart' : 'stop')
			.subscribe(resp => {
				$event.source.checked = resp.status === 'online';
			}, (err) => {
        $event.source.checked = false;
      });
	}
}
