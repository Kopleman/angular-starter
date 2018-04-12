import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { SubjectsData } from '../services/subjects-data';
import { ISubject, ISubjectQueryParams } from '../models/subject';
import { Observable } from 'rxjs/Observable';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { SubjectsPaginate } from '../store/actions';

@Component({
	selector: 'subjects-page',
	styleUrls: ['./subjects.component.scss'],
	templateUrl: './subjects.component.html'
})
export class SubjectsPageComponent implements OnInit {
  public filters$: Observable<ISubjectQueryParams>;
  public subjects: ISubject[];
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;

	constructor(
	  private subjectsData: SubjectsData,
    private actionSubject: ActionsSubject,
    private store: Store<ISubjectQueryParams>,
  ) {}

	public ngOnInit() {
    this.filters$ = this.store.pipe(select('filters'));
    this.actionSubject.subscribe(() => {
      this.filters$.take(1).subscribe((state) => {
        this.getSubjects(state);
      });
    });
	}

  public paginate($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    let skip = this.pageIndex * this.pageSize;
    this.store.dispatch(new SubjectsPaginate(skip, this.pageSize));
  }

	private getSubjects(state: ISubjectQueryParams) {
    this.inProgress = true;
    this.subjectsData
      .getSubjects(state.skip, state.limit)
      .shareReplay()
      .subscribe(response => {
        this.inProgress = false;
        this.total = response.count;
        this.subjects = response.subjects;
      });
  }
}
