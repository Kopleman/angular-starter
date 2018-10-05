import { Component, OnDestroy, OnInit } from '@angular/core';
import { TemplatesData } from '../services/templates-data';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { SubjectsData } from '../services/subjects-data';
import { Observable ,  of } from 'rxjs';
import { filter, flatMap, shareReplay } from 'rxjs/operators';
import {
	ITemplate,
	ITemplateFilters,
	ITemplateQueryParams
} from '../models/template';
import { ISubject } from '../models/subject';
import { CreateDialogComponent } from '../components/create-dialog/create-dialog.component';
import { ICreateDialogData } from '../models/dialog';
import { ActionsSubject, select, Store, UPDATE } from '@ngrx/store';
import { Paginate, ApplyFilters } from '../store/actions';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { Collection } from '../../shared/abstracts/collection';
import { AuthService } from '../../auth/services/auth';

@Component({
	selector: 'templates-page',
	styleUrls: ['./templates.component.scss'],
	templateUrl: './templates.component.html'
})
export class TemplatesPageComponent
	extends Collection<ITemplate[], ITemplateQueryParams>
	implements OnInit, OnDestroy {
	public collection: ITemplate[];
	public subjects$: Observable<ISubject[]>;
	constructor(
		private userData: AuthService,
		private actionSubject: ActionsSubject,
		private store: Store<ITemplateQueryParams>,
		private templatesData: TemplatesData,
		private subjectsData: SubjectsData,
		private snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		super();
	}

	/**
	 * При инициализации компонента фетчим первую страницу списка,
	 * и словарь сабжкетов
	 */
	public ngOnInit() {
		this.subjects$ = this.subjectsData.getSubjects().pipe(shareReplay(1));
		this.filters$ = this.store.pipe(select(ModuleTypes.TEMPLATES));
		this.getTemplates();
		this.actionSubjectSubscription = this.actionSubject
			.pipe(filter((action: ICustomAction) => this.actionFilter(action)))
			.subscribe(() => {
				this.getTemplates();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		let skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new Paginate(skip, this.pageSize));
	}

	public createNewTemplate() {
		let dialogResult: ICreateDialogData;
		let dialogRef = this.dialog.open<CreateDialogComponent, ICreateDialogData>(
			CreateDialogComponent,
			{
				width: '580px',
				closeOnNavigation: true,
				panelClass: 'create-dialog-component',
				data: {
					templateId: '',
					title: '',
					about: '',
					subjects$: this.subjects$,
					selectedSubject: ''
				}
			}
		);

		dialogRef
			.afterClosed()
			.pipe(flatMap(result => {
				if (!result) {
					return of(null);
				}
				dialogResult = result;
				this.snackBar.open(`Создаем новый шаблон`, 'Закрыть');
				let body = {
					templateId: result.templateId,
					title: result.title,
					subjectIds: [result.selectedSubject],
					about: result.about
				};

				return this.templatesData.createTemplate(body);
			}))
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Шаблон создан`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(
							new ApplyFilters({
								selectedCategory: dialogResult.selectedSubject,
								searchStr: dialogResult.templateId
							})
						);
					}
				},
				errorResp => {
					this.snackBar.open(
						`Ошибки при создании: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}

	public compileAll() {
		this.snackBar.open(`Компилируем все шаблоны`, 'Закрыть');
		this.templatesData.compileAll().subscribe(
			() => {
				this.snackBar.open(`Шаблоны скомпилированы`, 'Закрыть', {
					duration: 2000
				});
			},
			errorResp => {
				this.snackBar.open(
					`Ошибки при компиляции: ${errorResp.error.message}`,
					'Закрыть'
				);
			}
		);
	}

	public isAdmin() {
		return this.userData.isAdmin();
	}

	protected actionFilter(action) {
		return (
			action.feature === ModuleTypes.TEMPLATES &&
			action.type !== UPDATE
		);
	}

	/**
	 * Получить шаблоны с бэка с задаными параметрами
	 */
	private getTemplates() {
		this.inProgress = true;
		this.filters$
			.pipe(flatMap(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
				let filters: ITemplateFilters = {
					selectedCategory: state.selectedCategory,
					searchStr: state.searchStr,
					sortBy: state.sortBy
				};
				return this.templatesData.getTemplates(
					state.skip,
					state.limit,
					filters
				);
			}))
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.templates;
			});
	}
}
