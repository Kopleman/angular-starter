import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

export interface IEditHistory {
  user: string;
  lang: 'ru'|'en';
  time: string;
}

export interface ITemplate {
	_id: string;
  subjectIds: string[];
  dateCreate: string;
  author: {
    email: string;
  },
  editHistory: IEditHistory[];
  i18nTitles: { [key: string]: string; }
}

@Injectable()
export class TemplatesData {
	constructor(private api: Api, private router: Router) {}

	public getAllTemplates() {

		return this.api
			.get<ITemplate[], {}>('admin/templates/rest/all', {}, true);
			// .pipe(catchError(this.api.emptyResult([])));
	}
}
