import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { SubjectsData } from '../services/subjects-data';
import { ISubject, ISubjectFilters, ISubjectQueryParams } from '../models/subject';
import { Observable } from 'rxjs/Observable';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { SubjectsPaginate } from '../store/actions';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { Subscription } from 'rxjs/Subscription';


@Component({
	selector: 'subjects-page',
	styleUrls: ['./subjects.component.scss'],
	templateUrl: './subjects.component.html'
})
export class SubjectsPageComponent implements OnInit, OnDestroy {

  public subjects: ISubject[];
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;
  private actionSubjectSubscription: Subscription;
  private filters$: Observable<ISubjectQueryParams>;
	constructor(
	  private subjectsData: SubjectsData,
    private actionSubject: ActionsSubject,
    private store: Store<ISubjectQueryParams>,
  ) {}

	public ngOnInit() {
    this.filters$ = this.store.pipe(select(ModuleTypes.SUBJECTS));
    this.filters$.share().take(1).subscribe((state) => {
      this.pageIndex = state.skip / state.limit;
      this.pageSize = state.limit;
      this.getSubjects(state);
    }).unsubscribe();
    this.actionSubjectSubscription = this.actionSubject
      .skip(1)
      .filter((action: ICustomAction) =>  { return action.feature === ModuleTypes.SUBJECTS } )
      .subscribe(() => {
      this.filters$.take(1).subscribe((state) => {
        this.getSubjects(state);
      }).unsubscribe();
    });
	}

	public ngOnDestroy() {
    this.actionSubjectSubscription.unsubscribe();
  }

  public paginate($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    let skip = this.pageIndex * this.pageSize;
    this.store.dispatch(new SubjectsPaginate(skip, this.pageSize));
  }

	private getSubjects(state: ISubjectQueryParams) {
    this.inProgress = true;
    let filters: ISubjectFilters = {
      searchStr: state.searchStr,
      sortBy: state.sortBy
    };
    this.subjectsData
      .getSubjects(state.skip, state.limit, filters)
      .shareReplay()
      .subscribe(response => {
        this.inProgress = false;
        this.total = response.count;
        this.subjects = response.subjects;
      });
  }
}
