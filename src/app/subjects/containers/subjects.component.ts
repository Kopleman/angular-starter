import { Component, OnInit } from '@angular/core';
import { SubjectsData } from '../services/subjects-data';
import { ISubject, ISubjectQueryParams } from '../models/subject';

@Component({
	selector: 'subjects-page',
	styleUrls: ['./subjects.component.scss'],
	templateUrl: './subjects.component.html'
})
export class SubjectsPageComponent implements OnInit {
  public subjects: ISubject[];
	public total: number;
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public pageSizeOptions: number[] = [5, 10, 25];
	public inProgress: boolean = false;

	constructor(private subjectsData: SubjectsData) {}

	public ngOnInit() {
		console.log('inited');
	}

	private getSubjets(state: ISubjectQueryParams) {
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
