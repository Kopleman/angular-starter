import { Component, OnInit } from '@angular/core';
import { TemplatesData } from '../services/templates-data';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { SubjectsData } from '../services/subjects-data';
import { Observable } from 'rxjs/Observable';
import { ITemplate, ITemplateFilters } from '../models/template';
import { ISubject } from '../models/subject';
import { CreateDialogComponent } from '../components/create-dialog/create-dialog.component';
import { ICreateDialogData } from '../models/dialog';
import { of } from 'rxjs/observable/of';
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
		private subjectsData: SubjectsData,
		private snackBar: MatSnackBar,
		public dialog: MatDialog
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
			.flatMap(result => {
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
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Шаблон создан`, 'Закрыть', {
							duration: 2000
						});
						this.filterCollection({
							selectedCategory: dialogResult.selectedSubject,
							searchStr: dialogResult.templateId
						});
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

	/**
	 * Получить шаблоны с бэка с задаными параметрами
	 * @param skip
	 * @param limit
	 */
	private getTemplates(skip, limit) {
		this.inProgress = true;
		this.templatesData
			.getTemplates(skip, limit, this.filters)
			.shareReplay()
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.templates = response.templates;
			});
	}
}
