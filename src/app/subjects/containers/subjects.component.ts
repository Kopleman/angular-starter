import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SubjectsData } from '../services/subjects-data';
import { ActionsSubject, select, Store, UPDATE } from '@ngrx/store';
import {
  ISubject,
  ISubjectFilters,
  ISubjectQueryParams, ISubjectsResponse
} from '../models/subject';
import { SubjectsPaginate } from '../store/actions';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { Collection } from '../../shared/abstracts/collection';
import { filter, flatMap } from 'rxjs/operators';

@Component({
	selector: 'subjects-page',
	styleUrls: ['./subjects.component.scss'],
	templateUrl: './subjects.component.html'
})
export class SubjectsPageComponent
	extends Collection<ISubject[], ISubjectQueryParams>
	implements OnInit, OnDestroy {
	constructor(
		private subjectsData: SubjectsData,
		private actionSubject: ActionsSubject,
		private store: Store<ISubjectQueryParams>
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.SUBJECTS));
		this.getSubjects();
		this.actionSubjectSubscription = this.actionSubject
			.pipe( filter((action: ICustomAction) => this.actionFilter(action)) )
			.subscribe(() => {
				this.getSubjects();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
    const skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new SubjectsPaginate(skip, this.pageSize));
	}

	protected actionFilter(action) {
		return (
			action.feature === ModuleTypes.SUBJECTS &&
			action.type !== UPDATE
		);
	}

	private getSubjects() {
		this.inProgress = true;
		this.filters$
			.pipe(flatMap(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
        const filters: ISubjectFilters = {
					searchStr: state.searchStr,
					sortBy: state.sortBy
				};
				return this.subjectsData.getSubjects(state.skip, state.limit, filters);
			}))
			.subscribe((response: ISubjectsResponse) => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.subjects;
			});
	}
}
