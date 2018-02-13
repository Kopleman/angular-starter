import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	MatDialog,
	MatSlideToggleChange,
	MatSnackBar
} from '@angular/material';
import 'rxjs/add/operator/mergeMap';

import { TemplatesData } from '../../services/templates-data';
import { ISubject } from '../../models/subject';
import { AuthService } from '../../../auth/services/auth.service';
import { CloneDialogComponent } from '../clone-dialog/clone-dialog.component';
import { ITemplate, ITemplateFilters } from '../../models/template';
import { ICloneDialogData } from '../../models/dialog';


/**
 * Копонента карточки шаблона
 */
@Component({
	selector: 'templates-list-item',
	styleUrls: ['./list-item.component.scss'],
	templateUrl: './list-item.component.html'
})
export class TemplateListItemComponent implements OnInit {
	@Input() public subjects: ISubject[];
	@Input() public template: ITemplate;
	@Output()
	public onFilterChange: EventEmitter<ITemplateFilters> = new EventEmitter();
	@Output()
	public onDelete: EventEmitter<{ templateId: string }> = new EventEmitter();
	public userRole: string;
	constructor(
		private userData: AuthService,
		private templatesData: TemplatesData,
		private snackBar: MatSnackBar,
		public dialog: MatDialog
	) {}

	public ngOnInit() {
		this.userRole = this.userData.getProfile().getValue().role;
	}

	public isPermited() {
		return (
			this.userRole === 'templateMaster' ||
			this.userRole === 'admin' ||
			this.userRole === 'templateManager'
		);
	}

	public isParent() {
		return this.template.sourceTemplate === 'none';
	}

	public getTemplateType() {
		return this.isParent() ? 'parent' : 'clone';
	}

	public getTempalateLangs() {
		return Object.keys(this.template.i18nTitles);
	}

	public filterByName(name) {
		this.onFilterChange.emit({ searchStr: name, selectedCategory: '' });
	}

	public filterByCategory(category) {
		this.onFilterChange.emit({ searchStr: '', selectedCategory: category });
	}

	/**
	 * Обработчик тригера слайдера гулп-статуса
	 * @param {MatSlideToggleChange} $event
	 */
	public changeGulpStatus($event: MatSlideToggleChange) {
		this.templatesData
			.changeGulpStatus(this.template._id, $event.checked ? 'restart' : 'stop')
			.subscribe(
				resp => {
					$event.source.checked = resp.status === 'online';
				},
				() => {
					$event.source.checked = false;
				}
			);
	}

	public deleteTemplate() {
		this.snackBar.open(`Удаляем шаблон ${this.template._id}`, 'Закрыть');
		this.templatesData.delete(this.template._id).subscribe(
			() => {
				this.snackBar.open(`Шаблон удален `, 'Закрыть', {
					duration: 2000
				});
				this.onDelete.emit({ templateId: this.template._id });
			},
			() => {
				this.snackBar.open(
					`Не удалось удалить шаблон ${this.template._id}`,
					'Закрыть'
				);
			}
		);
	}

	public refreshSettings() {
		this.snackBar.open(
			`Обновляем settings.json у  ${this.template._id}`,
			'Закрыть'
		);
		this.templatesData.refreshSettings(this.template._id).subscribe(
			() => {
				this.snackBar.open(
					`Settings.json у ${this.template._id} обновлен`,
					'Закрыть',
					{
						duration: 2000
					}
				);
			},
			() => {
				this.snackBar.open(
					`Не удалось обновить settings.json у ${this.template._id}`,
					'Закрыть'
				);
			}
		);
	}

	public refreshCloneSettings() {
		this.snackBar.open(
			`Обновляем cloneSettings.json у  ${this.template._id}`,
			'Закрыть'
		);
		this.templatesData.refreshCloneSettings(this.template._id).subscribe(
			() => {
				this.snackBar.open(
					`CloneSettings.json у ${this.template._id} обновлен`,
					'Закрыть',
					{
						duration: 2000
					}
				);
			},
			() => {
				this.snackBar.open(
					`Не удалось обновить cloneSettings.json у ${this.template._id}`,
					'Закрыть'
				);
			}
		);
	}

	public compileAllClones() {
		this.snackBar.open(`Child шаблоны в процессе компиляции`, 'Закрыть');
		this.templatesData.compileClones(this.template._id).subscribe(
			() => {
				this.snackBar.open(`Компиляция завершена`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Ошибки компиляции в следующих шаблонах: ${errorResp.errors.join(
						','
					)}`,
					'Закрыть'
				);
			}
		);
	}

	public createClone(pageLess: boolean = false) {
	  let dialogResult:ICloneDialogData;
		let dialogRef = this.dialog.open(CloneDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'clone-dialog-component',
			data: {
				cloneName: '',
				author: '',
				type: pageLess ? 'pageLess' : 'normal'
			}
		});

		dialogRef
			.afterClosed()
			.flatMap(result =>{
        this.snackBar.open(`Шаблон в процессе клонирования`, 'Закрыть');
        dialogResult = result;
				return this.templatesData.createClone(
					this.template._id,
					result.cloneName,
					result.author,
					pageLess
				);
			}
			)
			.subscribe(() => {
        this.snackBar.open(`Шаблон склонирован`, 'Закрыть', {
          duration: 2000
        });
        this.filterByName(dialogResult.cloneName);
			},errorResp => {
        this.snackBar.open(
          `Ошибки при клонировании: ${errorResp.error.message}`,
          'Закрыть'
        );
      });
	}
}
