import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITemplate, ITemplateFilters, TemplatesData } from '../../../providers/templates-data';
import { ISubject } from '../../../providers/subjects-data';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { MatSnackBarRef } from '@angular/material/snack-bar/typings/snack-bar-ref';
import { SimpleSnackBar } from '@angular/material/snack-bar/typings/simple-snack-bar';

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
  @Output()
  public onDelete: EventEmitter<{templateId: string}> = new EventEmitter();

	constructor(private templatesData: TemplatesData, public snackBar: MatSnackBar) {}

	public getTemplateType() {
		return this.template.sourceTemplate === 'none' ? 'parent' : 'clone';
	}

	public getTempalateLangs() {
		return Object.keys(this.template.i18nTitles);
	}

	public filterByName(name) {
    this.onFilterChange.emit({searchStr: name, selectedCategory: ''});
  }

  public filterByCategory(category) {
    this.onFilterChange.emit({searchStr: '', selectedCategory: category});
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
			}, () => {
        $event.source.checked = false;
      });
	}

	public deleteTemplate() {
	  this.snackBar.open(`Удаляем шаблон ${this.template._id}`, 'Закрыть');
	  this.templatesData.delete(this.template._id).subscribe(
	    () => {
        this.snackBar.open(`Шаблон ${this.template._id}`, '', {duration: 2000});
	      this.onDelete.emit({ templateId: this.template._id });
      },
      (error) => {
        this.snackBar.open(`Не удалось удалить шаблон ${this.template._id}`, 'Закрыть');
      }
      )
}
}
