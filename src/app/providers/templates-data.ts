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
export interface IColorThemeBlock {
  preview: string[];
  previewColorBlock: string[];
}
export interface IColorThemes {
  default:  {
    site: {[key: string]: IColorThemeBlock; }
  };
  site: { [key: string]: IColorThemeBlock; };
}
export interface ITemplate {
	_id: string;
  subjectIds: string[];
  dateCreate: string;
  title: string;
  author: {
    email: string;
  };
  editHistory: IEditHistory[];
  i18nTitles: { [key: string]: string; };
  sourceTemplate: string;
  colorThemes: IColorThemes;
}

export interface ITemplateResponse {
  count: number;
  templates: ITemplate[];
}

@Injectable()
export class TemplatesData {
	constructor(private api: Api, private router: Router) {}

	public getAllTemplates(skip: number, limit: number, searchQuery: string = null) {

		return this.api
			.get<ITemplateResponse, {}>('admin/templates/rest/all', {skip, limit, searchQuery}, true);
			// .pipe(catchError(this.api.emptyResult([])));
	}
}
