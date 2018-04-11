import { Component, OnInit } from '@angular/core';
import { TemplatesData } from '../services/templates-data';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { SubjectsData } from '../services/subjects-data';
import { Observable } from 'rxjs/Observable';
import { ITemplate, ITemplateFilters, ITemplateQueryParams } from '../models/template';
import { ISubject } from '../models/subject';
import { CreateDialogComponent } from '../components/create-dialog/create-dialog.component';
import { ICreateDialogData } from '../models/dialog';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { Paginate } from '../store/actions/paginate.action';
import { ApplyFilters } from '../store/actions/apply-filters.action';

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
		selectedCategory: '',
    sortBy: '_id'
	};
	private filters$: Observable<ITemplateQueryParams>;
	constructor(
	  private actionSubject: ActionsSubject,
    private store: Store<ITemplateQueryParams>,
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
		this.subjects$ = this.subjectsData.getSubjects().shareReplay(1);
		this.filters$ = this.store.pipe(select('filters'));
		this.actionSubject.subscribe(() => {
		  this.filters$.take(1).subscribe((state) => {
        console.log(state);
        this.getTemplates(state);
      });
    })
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
						this.store.dispatch(new ApplyFilters({
              selectedCategory: dialogResult.selectedSubject,
              searchStr: dialogResult.templateId
            }));
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
   * @param state
   */
	private getTemplates(state: ITemplateQueryParams) {
		this.inProgress = true;
		let filters: ITemplateFilters = {
      selectedCategory: state.selectedCategory,
      searchStr: state.searchStr,
      sortBy: state.sortBy
    };
		this.templatesData
			.getTemplates(state.skip, state.limit, filters)
			.shareReplay()
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.templates = response.templates;
			});
	}
}
