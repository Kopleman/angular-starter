import { Component, Inject, Input, OnInit } from '@angular/core';
import {
	MatDialog,
	MatSlideToggleChange,
	MatSnackBar
} from '@angular/material';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { TemplatesData } from '../../services/templates-data';
import { ISubject } from '../../models/subject';
import { AuthService } from '../../../auth/services/auth';
import { CloneDialogComponent } from '../clone-dialog/clone-dialog.component';
import {
	ITemplate,
	ITemplateHost,
	ITemplateQueryParams
} from '../../models/template';
import { IChangePropsDialogData, ICloneDialogData } from '../../models/dialog';
import { PropsDialogComponent } from '../properties-dialog/props-dialog.component';
import { APP_CONFIG, AppConfig } from '../../../config.module';
import { Observable } from 'rxjs/Observable';
import { SubjectsData } from '../../services/subjects-data';
import { Store } from '@ngrx/store';
import { ApplyFilters, Refresh } from '../../store/actions';

/**
 * Копонента карточки шаблона
 */
@Component({
	selector: 'templates-list-item',
	styleUrls: ['./list-item.component.scss'],
	templateUrl: './list-item.component.html'
})
export class TemplateListItemComponent implements OnInit {
	public subjects$: Observable<ISubject[]>;
	@Input() public template: ITemplate;
	public userRole: string;
	public demoHosts$: Observable<ITemplateHost[]>;
	public pubHosts$: Observable<ITemplateHost[]>;
	constructor(
		private userData: AuthService,
		private templatesData: TemplatesData,
		private subjectsData: SubjectsData,
		private snackBar: MatSnackBar,
		public dialog: MatDialog,
		@Inject(APP_CONFIG) private config: AppConfig,
		private store: Store<ITemplateQueryParams>
	) {}

	public ngOnInit() {
		this.userRole = this.userData.getProfile().getValue().role;
		this.demoHosts$ = this.templatesData.getAvailableDemoHosts();
		this.pubHosts$ = this.templatesData.getAvailablePubHosts();
		this.subjects$ = this.subjectsData.getSubjects();
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
		this.store.dispatch(
			new ApplyFilters({ searchStr: name, selectedCategory: '' })
		);
	}

	public filterByCategory(category) {
		this.store.dispatch(
			new ApplyFilters({ searchStr: '', selectedCategory: category })
		);
	}

	public getTemplatePreviewUrl(lang) {
		return `${this.config.host}preview/template_${this.template._id}${
			lang !== 'ru' ? `_${lang}` : ``
		}`;
	}

	public translateSubjects() {
		return this.subjects$.map(subjects => {
			let ret: ISubject[] = [];
			this.template.subjectIds.forEach(subjectId => {
				let subject = _.find(subjects, s => s._id === subjectId);
				ret.push(subject ? subject : { _id: subjectId, title: subjectId });
			});
			return ret;
		});
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
				this.store.dispatch(new Refresh());
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

	public makeDemo(host: string) {
		this.snackBar.open(`Публикуем шаблон на demo-сервер - ${host}`, 'Закрыть');
		this.templatesData.publishDemo(this.template._id, host).subscribe(
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

	public publish(host: string) {
		this.snackBar.open(`Публикуем шаблон на сервер - ${host}`, 'Закрыть');
		this.templatesData.publish(this.template._id, host).subscribe(
			() => {
				this.snackBar.open(`Публикация завершена`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Произошла ошибка при публикации: ${errorResp.error.message}`,
					'Закрыть'
				);
			}
		);
	}

	public changeProps() {
		let dialogResult: IChangePropsDialogData;
		let dialogRef = this.dialog.open<
			PropsDialogComponent,
			IChangePropsDialogData
		>(PropsDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'properties-dialog-component',
			data: {
				template: this.template,
				subjects$: this.subjects$,
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
		this.snackBar.open(`Коммитим шаблон ${this.template._id}`, 'Закрыть');
		this.templatesData.commitTemplate(this.template._id).subscribe(
			() => {
				this.snackBar.open(`Шаблон ${this.template._id} закомичен`, 'Закрыть', {
					duration: 2000
				});
			},
			error => {
				console.log(error);
				this.snackBar.open(
					`Не удалось закомитеть ${this.template._id}`,
					'Закрыть'
				);
			}
		);
	}
}
