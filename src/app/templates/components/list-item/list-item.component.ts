import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output
} from '@angular/core';
import {
	MatDialog,
	MatSlideToggleChange,
	MatSnackBar
} from '@angular/material';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/mergeMap';
import * as _ from 'lodash';

import { TemplatesData } from '../../services/templates-data';
import { ISubject } from '../../models/subject';
import { AuthService } from '../../../auth/services/auth';
import { CloneDialogComponent } from '../clone-dialog/clone-dialog.component';
import { ITemplate, ITemplateFilters } from '../../models/template';
import { IChangePropsDialogData, ICloneDialogData } from '../../models/dialog';
import { PropertiesDialogComponent } from '../properties-dialog/properties-dialog.component';
import { APP_CONFIG, AppConfig } from '../../../config.module';

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
		public dialog: MatDialog,
		@Inject(APP_CONFIG) private config: AppConfig
	) {}

	public ngOnInit() {
		this.userRole = this.userData.getProfile().getValue().role
	}

	public isPermitted() {
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

	public getTemplatePreviewUrl(lang) {
		return `${this.config.host}preview/template_${this.template._id}${
			lang !== 'ru' ? `_${lang}` : ``
		}`;
	}

	public translateSubjects(subjects: string[]) {
		let ret = [];
		subjects.forEach(subjectId => {
			let subject = _.find(this.subjects, s => s._id === subjectId);
			ret.push(subject ? subject : { _id: subjectId, title: subjectId });
		});
		return ret;
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
		let dialogResult: ICloneDialogData;
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
			.flatMap(result => {
				if (!result) {
					return of(null);
				}
				this.snackBar.open(`Шаблон в процессе клонирования`, 'Закрыть');
				dialogResult = result;
				return this.templatesData.createClone(
					this.template._id,
					result.cloneName,
					result.author,
					pageLess
				);
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Шаблон склонирован`, 'Закрыть', {
							duration: 2000
						});
						this.filterByName(dialogResult.cloneName);
					}
				},
				errorResp => {
					this.snackBar.open(
						`Ошибки при клонировании: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}

	public makeDemo(mode: 'normal' | 'compile' = 'normal') {
		this.snackBar.open(`Публикуем шаблон на demo-сервер`, 'Закрыть');
		this.templatesData.publishDemo(this.template._id, mode).subscribe(
			() => {
				this.snackBar.open(`Публикация завершена`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Произошла ошибка при demo-публикации: ${errorResp.error.message}`,
					'Закрыть'
				);
			}
		);
	}

	public changeProps() {
		let dialogResult: IChangePropsDialogData;
		let dialogRef = this.dialog.open<
			PropertiesDialogComponent,
			IChangePropsDialogData
		>(PropertiesDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'properties-dialog-component',
			data: {
				template: this.template,
				subjects: this.subjects,
				selectedSubject: this.template.subjectIds[0],
				selectedWhiteLabel: this.template.whitelabelsIds.length
					? this.template.whitelabelsIds[0]
					: '',
				newTags: {}
			}
		});

		dialogRef
			.afterClosed()
			.flatMap(result => {
				if (!result) {
					return of(null);
				}
				result.template.subjectIds = [result.selectedSubject];
				_.forEach(result.newTags, (tags, lang) => {
					result.template.i18nTags[lang] = tags.split(',').map(v => v.trim());
				});
				dialogResult = result;
				this.snackBar.open(`Меняем пропсы шаблона`, 'Закрыть');

				return this.templatesData.updateSettings(result.template);
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Пропсы изменены`, 'Закрыть', {
							duration: 2000
						});
						this.template = dialogResult.template;
					}
				},
				errorResp => {
					this.snackBar.open(
						`Произошла ошибка при изминение пропсов: ${
							errorResp.error.message
						}`,
						'Закрыть'
					);
				}
			);
	}

	public commit() {
    this.snackBar.open(
      `Коммитим шаблон ${this.template._id}`,
      'Закрыть'
    );
    this.templatesData.commitTemplate(this.template._id).subscribe(
      () => {
        this.snackBar.open(
          `Шаблон ${this.template._id} закомичен`,
          'Закрыть',
          {
            duration: 2000
          }
        );
      },
      (error) => {
        console.log(error);
        this.snackBar.open(
          `Не удалось закомитеть ${this.template._id}`,
          'Закрыть'
        );
      }
    );
  }
}
