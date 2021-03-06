import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of ,  Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';


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
import {
  IChangePreviewDialogData,
  IChangePropsDialogData,
  ICloneDialogData,
  Ii18NDialogData
} from '../../models/dialog';
import { PropsDialogComponent } from '../properties-dialog/props-dialog.component';
import { APP_CONFIG, AppConfig } from '../../../config.module';
import { SubjectsData } from '../../services/subjects-data';
import { Store } from '@ngrx/store';
import { ApplyFilters, Refresh } from '../../store/actions';
import { I18nDialogComponent } from '../i18n-dialog/i18n-dialog.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { ChangePreviewsDialogComponent }
  from '../change-previews-dialog/change-previews-dialog.component';

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

	public isAdmin() {
		return this.userData.isAdmin();
	}

	public isParent() {
		return this.template.sourceTemplate === 'none';
	}

	public getTemplateType() {
		return this.isParent() ? 'parent' : 'clone';
	}

	public getTemplateLangs() {
		const langs = [ 'ru' ].concat(this.template.locales);
		/**
		 * Подымае ру и ен локаль в топ
		 */
		return langs
			.sort((lang) => lang === 'ru' ? -1 : 1)
			.sort((lang) => {
				 if (lang === 'ru') {
				 	return  0;
				 }
				 return lang === 'en' ? -1 : 1;
			});
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

	public getConstructorUrl(lang) {
		return `${this.config.host}sites/url/template_${this.template._id}${
			lang !== 'ru' ? `_${lang}` : ``
			}/pages/id/index/constructor`;
	}

	public translateSubjects() {
		return this.subjects$.pipe( map(subjects => {
			const ret: ISubject[] = [];
			this.template.subjectIds.forEach(subjectId => {
				const subject = _.find(subjects, s => s._id === subjectId);
				ret.push(subject ? subject : { _id: subjectId, title: subjectId });
			});
			return ret;
		}));
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
		const dialogRef = this.dialog.open(CloneDialogComponent, {
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
			.pipe(flatMap(result => {
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
			}))
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
						`Ошибки при клонировании: ${errorResp.message}`,
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
					`Произошла ошибка при demo-публикации: ${errorResp.message}`,
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
					`Произошла ошибка при публикации: ${errorResp.message}`,
					'Закрыть'
				);
			}
		);
	}

	public changeProps() {
		let dialogResult: IChangePropsDialogData;
		const dialogRef = this.dialog.open<
			PropsDialogComponent,
			IChangePropsDialogData
		>(PropsDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'properties-dialog-component',
			data: {
				template: this.template,
				subjects$: this.subjects$,
				selectedSubjects: this.template.subjectIds,
				selectedWhiteLabel: this.template.whitelabelsIds.length
					? this.template.whitelabelsIds[0]
					: '',
				newTags: {}
			}
		});

		dialogRef
			.afterClosed()
			.pipe(flatMap(result => {
				if (!result) {
					return of(null);
				}
				result.template.subjectIds = result.selectedSubjects;
				result.template.whitelabelsIds = [result.selectedWhiteLabel];
				_.forEach(result.newTags, (tags, lang) => {
					result.template.i18nTags[lang] = tags.split(',').map(v => v.trim());
				});
				dialogResult = result;
				this.snackBar.open(`Меняем пропсы шаблона`, 'Закрыть');

				return this.templatesData.updateSettings(result.template);
			}))
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
							errorResp.message
						}`,
						'Закрыть'
					);
				}
			);
	}

	public uploadPreviews() {

    this.dialog.open<
      ChangePreviewsDialogComponent,
      IChangePreviewDialogData
      >(ChangePreviewsDialogComponent,{
      width: '580px',
      closeOnNavigation: true,
      panelClass: 'upload-previews-dialog-component',
      data: {
        template: this.template
      }
      }).afterClosed();
  }

	public commit() {
		this.snackBar.open(`Коммитим шаблон ${this.template._id}`, 'Закрыть');
		this.templatesData.commitTemplate(this.template._id).subscribe(
			() => {
				this.snackBar.open(`Шаблон ${this.template._id} закомичен`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Не удалось закомитить ${this.template._id}: ${
						errorResp.message
						}`,
					'Закрыть'
				);
			}
		);
	}

	public workWithI18n() {

		this.dialog.open<I18nDialogComponent, Ii18NDialogData>(
			I18nDialogComponent, {
				width: '580px',
				closeOnNavigation: true,
				panelClass: 'i18n-dialog-component',
				data: {
					template: this.template
				}
			}
		);
	}

	public changeStatus() {
    let dialogResult: ITemplate;
    const dialogRef = this.dialog.open<StatusDialogComponent, ITemplate>(
      StatusDialogComponent, {
        width: '580px',
        closeOnNavigation: true,
        panelClass: 'i18n-dialog-component',
        data: this.template
      }
    );

    dialogRef
      .afterClosed()
      .pipe(flatMap(result => {
        if (!result) {
          return of(null);
        }
        dialogResult = result;
        this.snackBar.open(`Меняем статус шаблона`, 'Закрыть');

        return this.templatesData.changeTemplateStatus(this.template._id, result.status)

      }))
      .subscribe(
        result => {
          if (result) {
            this.snackBar.open(`Статус изминен`, 'Закрыть', {
              duration: 2000
            });
            this.template.status = dialogResult.status;
          }
        },
        errorResp => {
          this.snackBar.open(
            `Произошла ошибка при изминение пропсов: ${
              errorResp.message
              }`,
            'Закрыть'
          );
        }
      );
  }
}
