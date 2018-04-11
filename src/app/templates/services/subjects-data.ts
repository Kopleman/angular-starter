import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { ISubject } from '../models/subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubjectsData {
	private subjects$: Observable<ISubject[]>;
	constructor(private api: Api) {}

	public getSubjects() {
		if (!this.subjects$) {
			this.subjects$ = this._getSubjects().shareReplay(1);
		}
		return this.subjects$;
	}

	public _getSubjects() {
		return this.api.get<ISubject[], null>('admin/rest/subjects/short');
	}
}
